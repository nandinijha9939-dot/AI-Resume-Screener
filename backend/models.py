from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    skills = Column(String)
    matched_skills = Column(String)
    missing_skills = Column(String)
    resume_text = Column(Text)
    match_score = Column(Float)

# Add this new model
class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    created_at = Column(String, default=lambda: str(__import__('datetime').datetime.now()))