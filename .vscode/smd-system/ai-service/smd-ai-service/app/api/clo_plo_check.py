from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

# Load model for semantic similarity
model = SentenceTransformer('all-MiniLM-L6-v2')

class CLO(BaseModel):
    id: int
    code: str
    description: str
    bloomLevel: str
    weight: float

class PLO(BaseModel):
    id: int
    code: str
    description: str
    program: str
    category: str

class CLOPLOCheckRequest(BaseModel):
    clos: List[CLO]
    plos: List[PLO]
    callback_url: Optional[str] = None

class CLOPLOCheckResponse(BaseModel):
    task_id: str
    status: str
    message: str

class CLOPLOMapping(BaseModel):
    clo_id: int
    clo_code: str
    plo_id: int
    plo_code: str
    similarity_score: float
    mapping_strength: str  # 'strong', 'moderate', 'weak'
    recommended: bool

@router.post("/analyze", response_model=CLOPLOCheckResponse)
async def analyze_clo_plo_alignment(request: CLOPLOCheckRequest, background_tasks: BackgroundTasks):
    """
    Analyze CLO-PLO alignment and compliance
    """
    try:
        # Generate task ID
        task_id = f"clo_plo_{hash(str(request.clos) + str(request.plos))}"
        
        # Add background task
        background_tasks.add_task(
            process_clo_plo_analysis,
            task_id,
            request.clos,
            request.plos,
            request.callback_url
        )
        
        return CLOPLOCheckResponse(
            task_id=task_id,
            status="processing",
            message="CLO-PLO analysis started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_clo_plo_analysis(task_id: str, clos: List[CLO], plos: List[PLO], callback_url: str = None):
    """
    Process CLO-PLO alignment analysis
    """
    try:
        mappings = []
        
        # Generate embeddings for all CLOs and PLOs
        clo_texts = [f"{clo.code}: {clo.description}" for clo in clos]
        plo_texts = [f"{plo.code}: {plo.description}" for plo in plos]
        
        if clo_texts and plo_texts:
            clo_embeddings = model.encode(clo_texts)
            plo_embeddings = model.encode(plo_texts)
            
            # Calculate similarity matrix
            similarity_matrix = cosine_similarity(clo_embeddings, plo_embeddings)
            
            # Find best mappings for each CLO
            for i, clo in enumerate(clos):
                similarities = similarity_matrix[i]
                
                # Find top 3 most similar PLOs
                top_indices = np.argsort(similarities)[-3:][::-1]
                
                for j in top_indices:
                    plo = plos[j]
                    similarity_score = float(similarities[j])
                    
                    # Determine mapping strength
                    if similarity_score >= 0.8:
                        mapping_strength = "strong"
                        recommended = True
                    elif similarity_score >= 0.6:
                        mapping_strength = "moderate"
                        recommended = True
                    elif similarity_score >= 0.4:
                        mapping_strength = "weak"
                        recommended = False
                    else:
                        mapping_strength = "very_weak"
                        recommended = False
                    
                    mappings.append(CLOPLOMapping(
                        clo_id=clo.id,
                        clo_code=clo.code,
                        plo_id=plo.id,
                        plo_code=plo.code,
                        similarity_score=similarity_score,
                        mapping_strength=mapping_strength,
                        recommended=recommended
                    ))
        
        # Analyze compliance
        compliance_analysis = analyze_compliance(clos, plos, mappings)
        
        # Store results
        clo_plo_results[task_id] = {
            "status": "completed",
            "mappings": [mapping.dict() for mapping in mappings],
            "compliance": compliance_analysis,
            "statistics": {
                "total_clos": len(clos),
                "total_plos": len(plos),
                "strong_mappings": len([m for m in mappings if m.mapping_strength == "strong"]),
                "recommended_mappings": len([m for m in mappings if m.recommended]),
                "coverage_percentage": calculate_coverage_percentage(clos, mappings)
            }
        }
        
        # Send callback if provided
        if callback_url:
            await send_callback(callback_url, task_id, clo_plo_results[task_id])
            
    except Exception as e:
        clo_plo_results[task_id] = {
            "status": "failed",
            "error": str(e)
        }

def analyze_compliance(clos: List[CLO], plos: List[PLO], mappings: List[CLOPLOMapping]) -> Dict:
    """
    Analyze CLO-PLO compliance
    """
    compliance = {
        "overall_score": 0.0,
        "issues": [],
        "recommendations": []
    }
    
    # Check if all CLOs have at least one strong mapping
    unmapped_clos = []
    for clo in clos:
        strong_mappings = [m for m in mappings if m.clo_id == clo.id and m.mapping_strength == "strong"]
        if not strong_mappings:
            unmapped_clos.append(clo.code)
    
    if unmapped_clos:
        compliance["issues"].append(f"CLOs without strong PLO mapping: {', '.join(unmapped_clos)}")
        compliance["recommendations"].append("Review and strengthen alignment for unmapped CLOs")
    
    # Check PLO coverage
    mapped_plos = set(m.plo_id for m in mappings if m.recommended)
    total_plos = len(plos)
    coverage_ratio = len(mapped_plos) / total_plos if total_plos > 0 else 0
    
    if coverage_ratio < 0.7:
        compliance["issues"].append(f"Low PLO coverage: {coverage_ratio:.1%}")
        compliance["recommendations"].append("Ensure broader PLO coverage in course design")
    
    # Calculate overall compliance score
    mapping_score = len([m for m in mappings if m.recommended]) / len(clos) if clos else 0
    compliance["overall_score"] = (mapping_score + coverage_ratio) / 2
    
    return compliance

def calculate_coverage_percentage(clos: List[CLO], mappings: List[CLOPLOMapping]) -> float:
    """
    Calculate percentage of CLOs with recommended mappings
    """
    if not clos:
        return 0.0
    
    mapped_clos = set(m.clo_id for m in mappings if m.recommended)
    return len(mapped_clos) / len(clos) * 100

# In-memory storage for demo
clo_plo_results = {}

@router.get("/result/{task_id}")
async def get_clo_plo_result(task_id: str):
    """
    Get CLO-PLO analysis result
    """
    if task_id not in clo_plo_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return clo_plo_results[task_id]

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