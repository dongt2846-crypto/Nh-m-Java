from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict
import pytesseract
from PIL import Image
import PyPDF2
import io
import base64

router = APIRouter()

class OCRRequest(BaseModel):
    file_data: str  # Base64 encoded file
    file_type: str  # 'pdf', 'image'
    callback_url: Optional[str] = None

class OCRResponse(BaseModel):
    task_id: str
    status: str
    message: str

@router.post("/extract-text", response_model=OCRResponse)
async def extract_text_from_file(request: OCRRequest, background_tasks: BackgroundTasks):
    """
    Extract text from PDF or image files using OCR
    """
    try:
        # Generate task ID
        task_id = f"ocr_{hash(request.file_data[:100])}"
        
        # Add background task
        background_tasks.add_task(
            process_ocr,
            task_id,
            request.file_data,
            request.file_type,
            request.callback_url
        )
        
        return OCRResponse(
            task_id=task_id,
            status="processing",
            message="OCR text extraction started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-file")
async def upload_file_for_ocr(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    """
    Upload file and extract text using OCR
    """
    try:
        # Read file content
        file_content = await file.read()
        file_data = base64.b64encode(file_content).decode('utf-8')
        
        # Determine file type
        file_type = 'pdf' if file.filename.lower().endswith('.pdf') else 'image'
        
        # Generate task ID
        task_id = f"ocr_upload_{hash(file_data[:100])}"
        
        # Add background task
        background_tasks.add_task(
            process_ocr,
            task_id,
            file_data,
            file_type,
            None
        )
        
        return OCRResponse(
            task_id=task_id,
            status="processing",
            message="File uploaded and OCR started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_ocr(task_id: str, file_data: str, file_type: str, callback_url: str = None):
    """
    Process OCR text extraction
    """
    try:
        # Decode base64 file data
        file_bytes = base64.b64decode(file_data)
        
        extracted_text = ""
        
        if file_type == 'pdf':
            extracted_text = extract_text_from_pdf(file_bytes)
        else:
            extracted_text = extract_text_from_image(file_bytes)
        
        # Clean and process extracted text
        cleaned_text = clean_extracted_text(extracted_text)
        
        # Analyze text structure
        text_analysis = analyze_text_structure(cleaned_text)
        
        # Store results
        ocr_results[task_id] = {
            "status": "completed",
            "extracted_text": cleaned_text,
            "raw_text": extracted_text,
            "analysis": text_analysis,
            "statistics": {
                "character_count": len(cleaned_text),
                "word_count": len(cleaned_text.split()),
                "line_count": len(cleaned_text.split('\n')),
                "confidence_score": calculate_confidence_score(extracted_text)
            }
        }
        
        # Send callback if provided
        if callback_url:
            await send_callback(callback_url, task_id, ocr_results[task_id])
            
    except Exception as e:
        ocr_results[task_id] = {
            "status": "failed",
            "error": str(e)
        }

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from PDF file
    """
    try:
        pdf_file = io.BytesIO(file_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text
    except Exception as e:
        # If PDF text extraction fails, try OCR on PDF pages
        print(f"PDF text extraction failed, trying OCR: {e}")
        return extract_text_from_image(file_bytes)

def extract_text_from_image(file_bytes: bytes) -> str:
    """
    Extract text from image using OCR
    """
    try:
        image = Image.open(io.BytesIO(file_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Use Tesseract OCR
        text = pytesseract.image_to_string(image, lang='eng')
        
        return text
    except Exception as e:
        raise Exception(f"OCR extraction failed: {e}")

def clean_extracted_text(text: str) -> str:
    """
    Clean and normalize extracted text
    """
    if not text:
        return ""
    
    # Remove excessive whitespace
    import re
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters that might be OCR artifacts
    text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/]', '', text)
    
    # Fix common OCR errors
    text = text.replace('|', 'I')  # Common OCR mistake
    text = text.replace('0', 'O')  # In some contexts
    
    return text.strip()

def analyze_text_structure(text: str) -> Dict:
    """
    Analyze the structure of extracted text
    """
    if not text:
        return {}
    
    lines = text.split('\n')
    
    # Identify potential sections
    sections = []
    current_section = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if line looks like a heading (all caps, short, etc.)
        if (line.isupper() and len(line) < 50) or line.endswith(':'):
            if current_section:
                sections.append(current_section)
            current_section = {
                'title': line,
                'content': []
            }
        elif current_section:
            current_section['content'].append(line)
    
    if current_section:
        sections.append(current_section)
    
    # Extract potential course information
    course_info = extract_course_info(text)
    
    return {
        'sections': sections,
        'course_info': course_info,
        'has_structure': len(sections) > 1
    }

def extract_course_info(text: str) -> Dict:
    """
    Extract course-specific information from text
    """
    import re
    
    course_info = {}
    
    # Look for course code patterns
    course_code_pattern = r'\b[A-Z]{2,4}\s*\d{3,4}\b'
    course_codes = re.findall(course_code_pattern, text)
    if course_codes:
        course_info['course_codes'] = list(set(course_codes))
    
    # Look for credit patterns
    credit_pattern = r'(\d+)\s*credit[s]?'
    credits = re.findall(credit_pattern, text, re.IGNORECASE)
    if credits:
        course_info['credits'] = credits[0]
    
    # Look for semester patterns
    semester_pattern = r'(fall|spring|summer|winter)\s*\d{4}'
    semesters = re.findall(semester_pattern, text, re.IGNORECASE)
    if semesters:
        course_info['semesters'] = list(set(semesters))
    
    return course_info

def calculate_confidence_score(text: str) -> float:
    """
    Calculate confidence score for OCR extraction
    """
    if not text:
        return 0.0
    
    # Simple heuristic based on text characteristics
    score = 1.0
    
    # Penalize for too many special characters (OCR artifacts)
    special_char_ratio = len([c for c in text if not c.isalnum() and not c.isspace()]) / len(text)
    if special_char_ratio > 0.1:
        score -= special_char_ratio
    
    # Penalize for too many single characters (fragmented text)
    words = text.split()
    single_char_ratio = len([w for w in words if len(w) == 1]) / len(words) if words else 0
    if single_char_ratio > 0.2:
        score -= single_char_ratio
    
    return max(0.0, min(1.0, score))

# In-memory storage for demo
ocr_results = {}

@router.get("/result/{task_id}")
async def get_ocr_result(task_id: str):
    """
    Get OCR extraction result
    """
    if task_id not in ocr_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return ocr_results[task_id]

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