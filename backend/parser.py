import re

skills_db = [
    "Python",
    "C",
    "C++",
    "Java",
    "JavaScript",
    "React",
    "Node.js",
    "FastAPI",
    "SQL",
    "MongoDB",
    "Machine Learning",
    "Deep Learning",
    "OpenCV",
    "TensorFlow",
    "PyTorch",
    "Git",
    "HTML",
    "CSS",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "YOLO",
    "MediaPipe"
]


def parse_resume(text):

    lines = [line.strip() for line in text.split("\n") if line.strip()]
    name = lines[0] if lines else "Not Found"

    email = re.findall(r'[\w\.-]+@[\w\.-]+', text)

    phone = re.findall(r'(?:\+91[- ]?)?[6-9]\d{9}', text)

    found_skills = []

    for skill in skills_db:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return {
        "name": name,
        "email": email[0] if email else "Not Found",
        "phone": phone[0] if phone else "Not Found",
        "skills": found_skills
    }