from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model only once when server starts
model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text):
    return model.encode(text)


def calculate_similarity(resume_text, job_text):

    resume_embedding = get_embedding(resume_text)
    job_embedding = get_embedding(job_text)

    similarity = cosine_similarity(
        [resume_embedding],
        [job_embedding]
    )[0][0]

    return round(float(similarity) * 100, 2)