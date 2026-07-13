def skill_gap(resume_skills, job_description):

    job_skills = []

    common_skills = [
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
        "Git",
        "Docker",
        "AWS",
        "TensorFlow",
        "PyTorch",
        "Machine Learning",
        "Deep Learning",
        "OpenCV",
        "YOLO",
        "MediaPipe"
    ]

    for skill in common_skills:

        if skill.lower() in job_description.lower():
            job_skills.append(skill)

    matched = []
    missing = []

    for skill in job_skills:

        if skill in resume_skills:
            matched.append(skill)
        else:
            missing.append(skill)

    return matched, missing