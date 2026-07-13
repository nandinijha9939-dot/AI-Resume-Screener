import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function UploadJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const uploadJob = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const data = await response.json();

    console.log(data);

    alert("Fetch works!");
  } catch (e) {
    console.error(e);
    alert("Fetch failed");
  }
};

  return (
    <>
      <Navbar />
      <Sidebar />

      <div
        style={{
          marginLeft: "270px",
          marginTop: "80px",
          padding: "40px",
          background: "#0f172a",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <h1>Upload Job Description</h1>

        <br />

        <label>Job Title</label>

        <br />

        <input
          type="text"
          placeholder="Python AI Intern"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "500px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        />

        <br />

        <label>Job Description</label>

        <br />

        <textarea
          rows="10"
          cols="80"
          placeholder="Python FastAPI SQL Docker Git Machine Learning..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            marginTop: "10px",
          }}
        />

        <br />
        <br />

        <button
          onClick={uploadJob}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Upload Job
        </button>
      </div>
    </>
  );
}

export default UploadJob;