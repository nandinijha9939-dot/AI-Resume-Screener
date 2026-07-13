import { useState } from "react";
import api from "../services/api";

function UploadBox() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Select a PDF Resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume Uploaded Successfully");
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "25px",
        borderRadius: "12px",
        color: "white",
        marginBottom: "30px",
      }}
    >
      <h2>Upload Resume</h2>

      <br />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button
        onClick={uploadResume}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
}

export default UploadBox;