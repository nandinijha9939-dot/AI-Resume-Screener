from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from pydantic import BaseModel
from database import SessionLocal
from models import Candidate
from skills import skill_gap
from parser import parse_resume
from ai import calculate_similarity

import pdfplumber
import shutil
import os

app = FastAPI()

# ---------------- CORS ---------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly include OPTIONS
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight for 10 minutes
)

# -------------------------------------- #

os.makedirs("uploads", exist_ok=True)

job_description = ""


class JobDescription(BaseModel):
    title: str
    description: str


@app.get("/")
def home():
    return {
        "message": "AI Resume Screener Backend Running"
    }


# ---------------- Upload Job ---------------- #

@app.post("/job")
def upload_job(job: JobDescription):
    global job_description
    job_description = job.description
    
    return {
        "success": True,
        "message": "Job Description Saved Successfully",
        "title": job.title,
        "description": job.description
    }


# ---------------- Upload Resume ---------------- #

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    global job_description
    
    filepath = f"uploads/{file.filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = ""
    
    try:
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception:
        return {
            "success": False,
            "message": "Please upload a valid PDF."
        }
    
    data = parse_resume(text)
    
    if job_description != "":
        score = calculate_similarity(text, job_description)
        matched, missing = skill_gap(data.get("skills", []), job_description)
        data["matched_skills"] = matched
        data["missing_skills"] = missing
        data["match_score"] = score
    else:
        data["matched_skills"] = []
        data["missing_skills"] = []
        data["match_score"] = 0
    
    db = SessionLocal()
    candidate = Candidate(
        name=data.get("name", "Unknown"),
        email=data.get("email", "Not Found"),
        phone=data.get("phone", "Not Found"),
        skills=",".join(data.get("skills", [])),
        matched_skills=",".join(data.get("matched_skills", [])),
        missing_skills=",".join(data.get("missing_skills", [])),
        resume_text=text,
        match_score=data.get("match_score", 0)
    )
    
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    data["id"] = candidate.id
    db.close()
    
    return data


# ---------------- Candidates ---------------- #

@app.get("/candidates")
def get_candidates():
    db = SessionLocal()
    candidates = db.query(Candidate).all()
    result = []
    
    for c in candidates:
        result.append({
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "skills": c.skills.split(",") if c.skills else [],
            "matched_skills": c.matched_skills.split(",") if c.matched_skills else [],
            "missing_skills": c.missing_skills.split(",") if c.missing_skills else [],
            "match_score": c.match_score
        })
    
    db.close()
    return result


# ---------------- Ranking ---------------- #

@app.get("/ranking")
def get_ranking():
    db = SessionLocal()
    candidates = db.query(Candidate).order_by(Candidate.match_score.desc()).all()
    result = []
    
    for i, c in enumerate(candidates, start=1):
        result.append({
            "id": c.id,
            "rank": i,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "skills": c.skills.split(",") if c.skills else [],
            "matched_skills": c.matched_skills.split(",") if c.matched_skills else [],
            "missing_skills": c.missing_skills.split(",") if c.missing_skills else [],
            "match_score": c.match_score
        })
    
    db.close()
    return result


# ---------------- Candidate Details ---------------- #

@app.get("/candidate/{candidate_id}")
def get_candidate(candidate_id: int):
    db = SessionLocal()
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if candidate is None:
        db.close()
        return {
            "success": False,
            "message": "Candidate not found"
        }
    
    result = {
        "success": True,
        "id": candidate.id,
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "skills": candidate.skills.split(",") if candidate.skills else [],
        "matched_skills": candidate.matched_skills.split(",") if candidate.matched_skills else [],
        "missing_skills": candidate.missing_skills.split(",") if candidate.missing_skills else [],
        "resume_text": candidate.resume_text,
        "match_score": candidate.match_score
    }
    
    db.close()
    return result


# Add this OPTIONS handler for better CORS support
@app.options("/{path:path}")
async def options_handler():
    return {"message": "OK"}