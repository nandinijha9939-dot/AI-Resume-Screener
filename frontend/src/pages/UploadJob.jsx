import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function UploadJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setMessage("Please fill in both title and description.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      
      const response = await api.post("/job", {
        title: title.trim(),
        description: description.trim(),
      });

      if (response.data.success) {
        setMessage("✅ Job description uploaded successfully!");
        setMessageType("success");
        setTitle("");
        setDescription("");
        
        setTimeout(() => {
          navigate("/ranking");
        }, 2000);
      } else {
        setMessage(response.data.message || "Failed to upload job description.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Failed to upload job description. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
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
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ 
              fontSize: "2rem", 
              fontWeight: 700,
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              📋 Upload Job Description
            </h1>
            <p style={{ color: "#8a90a8", fontSize: "1rem" }}>
              Enter the job details to screen resumes against
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "40px",
            }}
          >
            {message && (
              <div
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  background:
                    messageType === "success"
                      ? "rgba(0, 184, 148, 0.15)"
                      : "rgba(239, 68, 68, 0.15)",
                  border:
                    messageType === "success"
                      ? "1px solid rgba(0, 184, 148, 0.3)"
                      : "1px solid rgba(239, 68, 68, 0.3)",
                  color: messageType === "success" ? "#00b894" : "#ef4444",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Job Title */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 500,
                    color: "#c4c9d6",
                  }}
                >
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Data Scientist"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "2px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6c63ff";
                    e.target.style.boxShadow = "0 0 0 4px rgba(108, 99, 255, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Job Description */}
              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 500,
                    color: "#c4c9d6",
                  }}
                >
                  Job Description *
                </label>
                <textarea
                  rows="8"
                  placeholder="Paste the full job description here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "2px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6c63ff";
                    e.target.style.boxShadow = "0 0 0 4px rgba(108, 99, 255, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background:
                    loading
                      ? "rgba(255, 255, 255, 0.05)"
                      : "linear-gradient(135deg, #6c63ff, #4a3fcf)",
                  border: "none",
                  borderRadius: "14px",
                  color: loading ? "#6a7084" : "white",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(108, 99, 255, 0.3)",
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#ffffff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></span>
                    Uploading...
                  </span>
                ) : (
                  "🚀 Upload Job Description"
                )}
              </button>
            </form>

            {/* Tips */}
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <h4 style={{ marginBottom: "10px", color: "#c4c9d6" }}>
                💡 Tips for best results
              </h4>
              <ul style={{ color: "#8a90a8", fontSize: "0.9rem", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "5px" }}>
                  Include required skills and qualifications
                </li>
                <li style={{ marginBottom: "5px" }}>
                  Be specific about technologies and tools
                </li>
                <li style={{ marginBottom: "5px" }}>
                  Mention experience level and education requirements
                </li>
                <li>Use clear section headers (Responsibilities, Requirements, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default UploadJob;