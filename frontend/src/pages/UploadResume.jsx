import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";  // ← Make sure this is imported

function UploadResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage("");
    } else {
      setFile(null);
      setMessage("Please select a valid PDF file.");
      setMessageType("error");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a PDF file to upload.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("");
      
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === false) {
        setMessage(response.data.message || "Upload failed. Please try again.");
        setMessageType("error");
      } else {
        setMessage("✅ Resume uploaded and analyzed successfully!");
        setMessageType("success");
        setFile(null);
        document.getElementById("file-input").value = "";
        
        setTimeout(() => {
          navigate("/ranking");
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Failed to upload resume. Please try again.");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />  {/* ← Navbar must be here */}
      <Sidebar />  {/* ← Sidebar must be here */}
      
      <div style={{
        marginLeft: "270px",  // ← This makes room for sidebar
        marginTop: "80px",    // ← This makes room for navbar
        padding: "30px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
              📄 Upload Resume
            </h1>
            <p style={{ color: "#8a90a8", marginBottom: "30px" }}>
              Upload a PDF resume for AI screening
            </p>

            {message && (
              <div style={{
                padding: "14px 20px",
                borderRadius: "12px",
                marginBottom: "20px",
                background: messageType === "success" 
                  ? "rgba(0, 184, 148, 0.15)" 
                  : "rgba(239, 68, 68, 0.15)",
                color: messageType === "success" ? "#00b894" : "#ef4444",
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div style={{
                border: "2px dashed rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center",
                position: "relative",
                cursor: "pointer",
              }}>
                <div style={{ fontSize: "4rem", marginBottom: "15px" }}>
                  {file ? "📎" : "📤"}
                </div>
                
                {file ? (
                  <div>
                    <div style={{
                      display: "inline-block",
                      padding: "8px 20px",
                      background: "rgba(0, 184, 148, 0.15)",
                      borderRadius: "12px",
                      color: "#00b894",
                      fontWeight: 600,
                    }}>
                      ✅ {file.name}
                    </div>
                    <p style={{ color: "#6a7084", marginTop: "10px" }}>
                      {(file.size / 1024).toFixed(0)} KB • Ready to upload
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                      Drop your PDF here
                    </p>
                    <p style={{ color: "#6a7084" }}>or click to browse files</p>
                  </div>
                )}

                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                style={{
                  width: "100%",
                  padding: "16px",
                  marginTop: "20px",
                  background: !file || uploading
                    ? "rgba(255, 255, 255, 0.05)"
                    : "linear-gradient(135deg, #6c63ff, #4a3fcf)",
                  border: "none",
                  borderRadius: "14px",
                  color: !file || uploading ? "#6a7084" : "white",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  cursor: !file || uploading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {uploading ? "⏳ Analyzing..." : "🚀 Upload & Analyze"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadResume;