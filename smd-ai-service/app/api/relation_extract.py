from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import re
from sentence_transformers import SentenceTransformer

router = APIRouter()

# Load model for semantic analysis
model = SentenceTransformer('all-MiniLM-L6-v2')

class CourseRelation(BaseModel):
    course_code: str
    course_name: str
    relation_type: str  # 'prerequisite', 'corequisite', 'successor'
    strength: float

class RelationExtractRequest(BaseModel):
    syllabi: List[Dict[str, Any]]
    callback_url: Optional[str] = None

class RelationExtractResponse(BaseModel):
    task_id: str
    status: str
    message: str

@router.post("/extract", response_model=RelationExtractResponse)
async def extract_course_relations(request: RelationExtractRequest, background_tasks: BackgroundTasks):
    """
    Extract relationships between courses from syllabi
    """
    try:
        # Generate task ID
        task_id = f"relation_{hash(str(request.syllabi))}"
        
        # Add background task
        background_tasks.add_task(
            process_relation_extraction,
            task_id,
            request.syllabi,
            request.callback_url
        )
        
        return RelationExtractResponse(
            task_id=task_id,
            status="processing",
            message="Course relation extraction started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_relation_extraction(task_id: str, syllabi: List[Dict], callback_url: str = None):
    """
    Process course relationship extraction
    """
    try:
        course_relations = {}
        
        for syllabus in syllabi:
            course_code = syllabus.get('courseCode', '')
            course_name = syllabus.get('courseName', '')
            prerequisites = syllabus.get('prerequisites', '')
            
            if not course_code:
                continue
            
            # Extract prerequisite relationships
            prereq_courses = extract_prerequisite_courses(prerequisites)
            
            # Extract semantic relationships with other courses
            semantic_relations = find_semantic_relationships(syllabus, syllabi)
            
            course_relations[course_code] = {
                'course_name': course_name,
                'prerequisites': prereq_courses,
                'semantic_relations': semantic_relations,
                'successor_courses': []  # Will be filled in post-processing
            }
        
        # Post-process to find successor relationships
        for course_code, relations in course_relations.items():
            for other_code, other_relations in course_relations.items():
                if course_code != other_code:
                    # If this course is a prerequisite for another, mark as successor
                    if course_code in [p['course_code'] for p in other_relations['prerequisites']]:
                        relations['successor_courses'].append({
                            'course_code': other_code,
                            'course_name': other_relations['course_name'],
                            'relation_type': 'successor',
                            'strength': 1.0
                        })
        
        # Build relationship graph
        relationship_graph = build_relationship_graph(course_relations)
        
        # Store results
        relation_results[task_id] = {
            "status": "completed",
            "course_relations": course_relations,
            "relationship_graph": relationship_graph,
            "statistics": {
                "total_courses": len(syllabi),
                "courses_with_prerequisites": len([c for c in course_relations.values() if c['prerequisites']]),
                "total_relationships": sum(len(c['prerequisites']) + len(c['successor_courses']) for c in course_relations.values())
            }
        }
        
        # Send callback if provided
        if callback_url:
            await send_callback(callback_url, task_id, relation_results[task_id])
            
    except Exception as e:
        relation_results[task_id] = {
            "status": "failed",
            "error": str(e)
        }

def extract_prerequisite_courses(prerequisites_text: str) -> List[Dict]:
    """
    Extract course codes from prerequisites text
    """
    if not prerequisites_text:
        return []
    
    # Common course code patterns
    course_patterns = [
        r'\b[A-Z]{2,4}\s*\d{3,4}\b',  # CS101, MATH 201, etc.
        r'\b[A-Z]{2,4}-\d{3,4}\b',    # CS-101, MATH-201, etc.
    ]
    
    found_courses = []
    for pattern in course_patterns:
        matches = re.findall(pattern, prerequisites_text, re.IGNORECASE)
        for match in matches:
            course_code = match.strip().upper().replace(' ', '').replace('-', '')
            if course_code not in [c['course_code'] for c in found_courses]:
                found_courses.append({
                    'course_code': course_code,
                    'relation_type': 'prerequisite',
                    'strength': 1.0,
                    'extracted_from': match
                })
    
    return found_courses

def find_semantic_relationships(target_syllabus: Dict, all_syllabi: List[Dict]) -> List[Dict]:
    """
    Find semantically related courses based on content similarity
    """
    target_content = f"{target_syllabus.get('description', '')} {target_syllabus.get('objectives', '')}"
    target_code = target_syllabus.get('courseCode', '')
    
    if not target_content.strip():
        return []
    
    semantic_relations = []
    
    for other_syllabus in all_syllabi:
        other_code = other_syllabus.get('courseCode', '')
        other_name = other_syllabus.get('courseName', '')
        
        if other_code == target_code or not other_code:
            continue
        
        other_content = f"{other_syllabus.get('description', '')} {other_syllabus.get('objectives', '')}"
        
        if not other_content.strip():
            continue
        
        # Calculate semantic similarity
        try:
            embeddings = model.encode([target_content, other_content])
            similarity = float(embeddings[0] @ embeddings[1] / (
                (embeddings[0] @ embeddings[0]) ** 0.5 * (embeddings[1] @ embeddings[1]) ** 0.5
            ))
            
            # Only include if similarity is above threshold
            if similarity > 0.3:
                semantic_relations.append({
                    'course_code': other_code,
                    'course_name': other_name,
                    'relation_type': 'semantic_similarity',
                    'strength': similarity
                })
        except Exception as e:
            print(f"Error calculating similarity: {e}")
            continue
    
    # Sort by similarity strength
    semantic_relations.sort(key=lambda x: x['strength'], reverse=True)
    
    # Return top 5 most similar courses
    return semantic_relations[:5]

def build_relationship_graph(course_relations: Dict) -> Dict:
    """
    Build a graph representation of course relationships
    """
    nodes = []
    edges = []
    
    for course_code, relations in course_relations.items():
        # Add node
        nodes.append({
            'id': course_code,
            'label': f"{course_code}\n{relations['course_name'][:30]}...",
            'type': 'course'
        })
        
        # Add prerequisite edges
        for prereq in relations['prerequisites']:
            edges.append({
                'from': prereq['course_code'],
                'to': course_code,
                'type': 'prerequisite',
                'strength': prereq['strength']
            })
        
        # Add semantic similarity edges (only strong ones)
        for semantic in relations['semantic_relations']:
            if semantic['strength'] > 0.6:
                edges.append({
                    'from': course_code,
                    'to': semantic['course_code'],
                    'type': 'semantic',
                    'strength': semantic['strength']
                })
    
    return {
        'nodes': nodes,
        'edges': edges
    }

# In-memory storage for demo
relation_results = {}

@router.get("/result/{task_id}")
async def get_relation_result(task_id: str):
    """
    Get course relation extraction result
    """
    if task_id not in relation_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return relation_results[task_id]

async def send_callback(callback_url: str, task_id: str, result: Dict):
    """
    Send callback to backend with results
    """
    import requests
    try:
        requests.post(callback_url, json={
            "task_id": task_id,
            "result": result
        })
    except Exception as e:
        print(f"Failed to send callback: {e}")