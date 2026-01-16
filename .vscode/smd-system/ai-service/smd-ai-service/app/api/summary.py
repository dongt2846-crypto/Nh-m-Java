from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, Optional
import re
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import os

router = APIRouter()

# Load summarization model
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
except Exception as e:
    print(f"Warning: Could not load summarization model: {e}")
    summarizer = None

# Load Vietnamese NLP model
vncorenlp_model = None
try:
    # Try to load VnCoreNLP model - it will download automatically if not present
    from vncorenlp import VnCoreNLP  # type: ignore  # noqa: F401
    vncorenlp_model = VnCoreNLP(annotators="wseg,pos,ner", max_heap_size='-Xmx2g')
except Exception as e:
    print(f"Warning: Could not load VnCoreNLP model: {e}")
    print("Vietnamese NLP features will be disabled")
    try:
        # Fallback to underthesea for Vietnamese processing
        from underthesea import word_tokenize, pos_tag, ner  # type: ignore  # noqa: F401
        print("Using underthesea as fallback for Vietnamese NLP")
    except Exception as e2:
        print(f"Warning: underthesea also failed: {e2}")

class SummaryRequest(BaseModel):
    syllabus: Dict[str, Any]
    max_length: Optional[int] = 150
    min_length: Optional[int] = 50
    callback_url: Optional[str] = None

class SummaryResponse(BaseModel):
    task_id: str
    status: str
    message: str

@router.post("/generate", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest, background_tasks: BackgroundTasks):
    """
    Generate AI summary of syllabus content
    """
    try:
        # Generate task ID
        task_id = f"summary_{hash(str(request.syllabus))}"
        
        # Add background task
        background_tasks.add_task(
            process_summary,
            task_id,
            request.syllabus,
            request.max_length,
            request.min_length,
            request.callback_url
        )
        
        return SummaryResponse(
            task_id=task_id,
            status="processing",
            message="Summary generation started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_summary(task_id: str, syllabus: Dict, max_length: int, min_length: int, callback_url: str = None):
    """
    Process syllabus summarization
    """
    try:
        # Extract and combine relevant text content
        content_parts = []
        
        if syllabus.get('description'):
            content_parts.append(f"Course Description: {syllabus['description']}")
        
        if syllabus.get('objectives'):
            content_parts.append(f"Learning Objectives: {syllabus['objectives']}")
        
        if syllabus.get('assessmentMethods'):
            content_parts.append(f"Assessment: {syllabus['assessmentMethods']}")
        
        if syllabus.get('prerequisites'):
            content_parts.append(f"Prerequisites: {syllabus['prerequisites']}")
        
        full_text = " ".join(content_parts)
        
        if not full_text.strip():
            summary_results[task_id] = {
                "status": "completed",
                "summary": "No content available for summarization",
                "key_points": [],
                "word_count": 0
            }
            return
        
        # Generate summary
        if summarizer and len(full_text) > 100:
            # Use AI model for summarization
            summary_result = summarizer(
                full_text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )
            ai_summary = summary_result[0]['summary_text']
        else:
            # Fallback to extractive summarization
            ai_summary = extractive_summary(full_text, max_length)

        # Enhance summary with Vietnamese NLP if available
        if vncorenlp_model and contains_vietnamese(full_text):
            ai_summary = enhance_vietnamese_summary(ai_summary, full_text)
        
        # Extract key points
        key_points = extract_key_points(syllabus)
        
        # Store results
        summary_results[task_id] = {
            "status": "completed",
            "summary": ai_summary,
            "key_points": key_points,
            "word_count": len(ai_summary.split()),
            "original_length": len(full_text.split()),
            "compression_ratio": len(ai_summary.split()) / len(full_text.split()) if full_text else 0
        }
        
        # Send callback if provided
        if callback_url:
            await send_callback(callback_url, task_id, summary_results[task_id])
            
    except Exception as e:
        summary_results[task_id] = {
            "status": "failed",
            "error": str(e)
        }

def extractive_summary(text: str, max_length: int) -> str:
    """
    Simple extractive summarization as fallback
    """
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if not sentences:
        return text[:max_length] + "..." if len(text) > max_length else text
    
    # Score sentences by length and position (simple heuristic)
    scored_sentences = []
    for i, sentence in enumerate(sentences):
        score = len(sentence.split()) * (1 - i / len(sentences))  # Prefer longer, earlier sentences
        scored_sentences.append((score, sentence))
    
    # Sort by score and take top sentences
    scored_sentences.sort(reverse=True)
    
    summary_sentences = []
    current_length = 0
    
    for score, sentence in scored_sentences:
        sentence_length = len(sentence.split())
        if current_length + sentence_length <= max_length:
            summary_sentences.append(sentence)
            current_length += sentence_length
        else:
            break
    
    return ". ".join(summary_sentences) + "."

def extract_key_points(syllabus: Dict) -> list:
    """
    Extract key points from syllabus
    """
    key_points = []
    
    # Course info
    if syllabus.get('courseCode') and syllabus.get('courseName'):
        key_points.append(f"Course: {syllabus['courseCode']} - {syllabus['courseName']}")
    
    if syllabus.get('credits'):
        key_points.append(f"Credits: {syllabus['credits']}")
    
    if syllabus.get('semester') and syllabus.get('academicYear'):
        key_points.append(f"Offered: {syllabus['semester']} {syllabus['academicYear']}")
    
    # Prerequisites
    if syllabus.get('prerequisites'):
        prereq_text = syllabus['prerequisites'][:100] + "..." if len(syllabus['prerequisites']) > 100 else syllabus['prerequisites']
        key_points.append(f"Prerequisites: {prereq_text}")
    
    return key_points

# In-memory storage for demo
summary_results = {}

@router.get("/result/{task_id}")
async def get_summary_result(task_id: str):
    """
    Get summary generation result
    """
    if task_id not in summary_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return summary_results[task_id]

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

def contains_vietnamese(text: str) -> bool:
    """
    Check if text contains Vietnamese characters
    """
    vietnamese_chars = "àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ"
    return any(char in text.lower() for char in vietnamese_chars)

def enhance_vietnamese_summary(summary: str, original_text: str) -> str:
    """
    Enhance summary with Vietnamese NLP processing
    """
    try:
        if not vncorenlp_model:
            return summary

        # Process original text with VnCoreNLP
        annotated = vncorenlp_model.annotate(original_text)

        # Extract key Vietnamese phrases
        vietnamese_phrases = []
        if 'sentences' in annotated:
            for sentence in annotated['sentences']:
                if 'words' in sentence:
                    for word_info in sentence['words']:
                        word = word_info.get('form', '')
                        pos = word_info.get('posTag', '')
                        # Extract nouns and proper nouns
                        if pos in ['Np', 'N', 'Nc', 'Nu', 'Ny'] and len(word) > 2:
                            vietnamese_phrases.append(word)

        # Add key Vietnamese terms to summary if not already present
        enhanced_summary = summary
        for phrase in vietnamese_phrases[:3]:  # Add up to 3 key phrases
            if phrase.lower() not in enhanced_summary.lower():
                enhanced_summary += f" ({phrase})"

        return enhanced_summary

    except Exception as e:
        print(f"Error enhancing Vietnamese summary: {e}")
        return summary
