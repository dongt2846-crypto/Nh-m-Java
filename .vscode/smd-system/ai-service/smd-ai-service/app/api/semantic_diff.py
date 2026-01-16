from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import difflib
import json
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

# Load sentence transformer model for semantic similarity
model = SentenceTransformer('all-MiniLM-L6-v2')

class SemanticDiffRequest(BaseModel):
    syllabus1: Dict[str, Any]
    syllabus2: Dict[str, Any]
    callback_url: Optional[str] = None

class SemanticDiffResponse(BaseModel):
    task_id: str
    status: str
    message: str

class DiffResult(BaseModel):
    field: str
    change_type: str  # 'added', 'removed', 'modified'
    old_value: str
    new_value: str
    similarity_score: float
    semantic_change: bool

@router.post("/compare", response_model=SemanticDiffResponse)
async def compare_syllabi(request: SemanticDiffRequest, background_tasks: BackgroundTasks):
    """
    Compare two syllabi and detect semantic differences
    """
    try:
        # Generate task ID
        task_id = f"diff_{hash(str(request.syllabus1) + str(request.syllabus2))}"
        
        # Add background task
        background_tasks.add_task(
            process_semantic_diff,
            task_id,
            request.syllabus1,
            request.syllabus2,
            request.callback_url
        )
        
        return SemanticDiffResponse(
            task_id=task_id,
            status="processing",
            message="Semantic diff analysis started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_semantic_diff(task_id: str, syllabus1: Dict, syllabus2: Dict, callback_url: str = None):
    """
    Process semantic difference analysis between two syllabi
    """
    try:
        results = []
        
        # Fields to compare
        fields_to_compare = [
            'description', 'objectives', 'prerequisites', 
            'assessmentMethods', 'textbooks', 'references'
        ]
        
        for field in fields_to_compare:
            old_value = syllabus1.get(field, "")
            new_value = syllabus2.get(field, "")
            
            if old_value != new_value:
                # Calculate semantic similarity
                similarity_score = calculate_semantic_similarity(old_value, new_value)
                
                # Determine if it's a semantic change (threshold: 0.8)
                semantic_change = similarity_score < 0.8
                
                # Determine change type
                if not old_value and new_value:
                    change_type = "added"
                elif old_value and not new_value:
                    change_type = "removed"
                else:
                    change_type = "modified"
                
                results.append(DiffResult(
                    field=field,
                    change_type=change_type,
                    old_value=old_value,
                    new_value=new_value,
                    similarity_score=similarity_score,
                    semantic_change=semantic_change
                ))
        
        # Store results (in production, use database)
        diff_results[task_id] = {
            "status": "completed",
            "results": [result.dict() for result in results],
            "summary": {
                "total_changes": len(results),
                "semantic_changes": sum(1 for r in results if r.semantic_change),
                "fields_changed": [r.field for r in results]
            }
        }
        
        # Send callback if provided
        if callback_url:
            await send_callback(callback_url, task_id, diff_results[task_id])
            
    except Exception as e:
        diff_results[task_id] = {
            "status": "failed",
            "error": str(e)
        }

def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """
    Calculate semantic similarity between two texts using sentence transformers
    """
    if not text1 or not text2:
        return 0.0
    
    # Generate embeddings
    embeddings = model.encode([text1, text2])
    
    # Calculate cosine similarity
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    
    return float(similarity)

# In-memory storage for demo (use Redis/database in production)
diff_results = {}

@router.get("/result/{task_id}")
async def get_diff_result(task_id: str):
    """
    Get semantic diff analysis result
    """
    if task_id not in diff_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return diff_results[task_id]

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