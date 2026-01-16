from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import importlib

app = FastAPI(
    title="SMD AI Service",
    description="AI Microservice for Syllabus Management and Digitalization",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers (lazy import to allow server to start even if optional deps are missing)
available_apis = []
missing_apis = {}

def try_include(name: str, module_name: str, prefix: str, tag: str):
    try:
        mod = importlib.import_module(module_name)
        app.include_router(mod.router, prefix=prefix, tags=[tag])
        available_apis.append(name)
    except Exception as e:
        missing_apis[name] = str(e)

try_include('semantic_diff', 'app.api.semantic_diff', '/api/semantic-diff', 'Semantic Diff')
try_include('summary', 'app.api.summary', '/api/summary', 'Summary')
try_include('clo_plo_check', 'app.api.clo_plo_check', '/api/clo-plo-check', 'CLO-PLO Check')
try_include('relation_extract', 'app.api.relation_extract', '/api/relation-extract', 'Relation Extract')
try_include('ocr', 'app.api.ocr', '/api/ocr', 'OCR')

@app.get("/")
async def root():
    return {"message": "SMD AI Service is running", "available_apis": available_apis, "missing_apis": missing_apis}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "smd-ai-service"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)