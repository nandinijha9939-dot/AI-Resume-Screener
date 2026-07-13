from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, Float


class Base(DeclarativeBase):
    pass


class Candidate(Base):

    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    email = Column(String)

    phone = Column(String)

    skills = Column(String)

    matched_skills = Column(String)

    missing_skills = Column(String)

    resume_text = Column(String)

    match_score = Column(Float)