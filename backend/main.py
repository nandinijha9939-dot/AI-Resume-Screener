from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, init_db
from models import Candidate, JobDescription as JobDescriptionModel
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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-frontend.onrender.com",  # Replace with your frontend URL
        "*",  # Allow all during development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# -------------------------------------- #

os.makedirs("uploads", exist_ok=True)


class JobDescription(BaseModel):
    title: str
    description: str


# ---------------- Initialize Database on Startup ---------------- #

@app.on_event("startup")
def startup_event():
    """Initialize database tables on application startup"""
    init_db()
    print("✅ Database initialized successfully")


# ---------------- Root Endpoint ---------------- #

@app.get("/")
def home():
    return {"message": "AI Resume Screener Backend Running"}


# ---------------- Upload Job ---------------- #

@app.post("/job")
def upload_job(job: JobDescription):
    """Save job description to database"""
    db = SessionLocal()
    
    try:
        job_entry = JobDescriptionModel(
            title=job.title,
            description=job.description
        )
        
        db.add(job_entry)
        db.commit()
        db.refresh(job_entry)
        
        return {
            "success": True,
            "message": "✅ Job Description Saved Successfully",
            "title": job.title,
            "description": job.description,
            "id": job_entry.id
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"❌ Failed to save job description: {str(e)}"
        }
    finally:
        db.close()


# ---------------- Get Latest Job Description ---------------- #

@app.get("/job/latest")
def get_latest_job():
    """Get the most recent job description"""
    db = SessionLocal()
    try:
        job = db.query(JobDescriptionModel).order_by(
            JobDescriptionModel.id.desc()
        ).first()
        
        if job:
            return {
                "success": True,
                "title": job.title,
                "description": job.description,
                "id": job.id,
                "created_at": job.created_at
            }
        return {
            "success": False,
            "message": "No job description found. Please upload a job description first."
        }
    finally:
        db.close()


# ---------------- Upload Resume ---------------- #

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze a resume against the latest job description"""
    
    # Get latest job description from database
    db = SessionLocal()
    try:
        job = db.query(JobDescriptionModel).order_by(
            JobDescriptionModel.id.desc()
        ).first()
        job_description = job.description if job else ""
        db.close()
    except Exception:
        db.close()
        job_description = ""
    
    # Save uploaded file
    filepath = f"uploads/{file.filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extract text from PDF
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
    
    # Parse resume
    data = parse_resume(text)
    
    # Calculate match score if job description exists
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
    
    # Save to database
    db = SessionLocal()
    try:
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
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"❌ Failed to save candidate: {str(e)}"
        }
    finally:
        db.close()
    
    return data


# ---------------- Get All Candidates ---------------- #

@app.get("/candidates")
def get_candidates():
    """Get all candidates"""
    db = SessionLocal()
    try:
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
        
        return result
    finally:
        db.close()


# ---------------- Get Ranking ---------------- #

@app.get("/ranking")
def get_ranking():
    """Get candidates ranked by match score"""
    db = SessionLocal()
    try:
        candidates = db.query(Candidate).order_by(
            Candidate.match_score.desc()
        ).all()
        
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
        
        return result
    finally:
        db.close()


# ---------------- Get Candidate Details ---------------- #

@app.get("/candidate/{candidate_id}")
def get_candidate(candidate_id: int):
    """Get detailed information about a specific candidate"""
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(
            Candidate.id == candidate_id
        ).first()
        
        if candidate is None:
            return {
                "success": False,
                "message": "Candidate not found"
            }
        
        return {
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
    finally:
        db.close()


# ---------------- Health Check ---------------- #

@app.get("/health")
def health_check():
    """Health check endpoint for Render"""
    return {"status": "healthy"}


# ---------------- OPTIONS Handler for CORS ---------------- #

@app.options("/{path:path}")
async def options_handler():
    """Handle OPTIONS requests for CORS preflight"""
    return {"message": "OK"}