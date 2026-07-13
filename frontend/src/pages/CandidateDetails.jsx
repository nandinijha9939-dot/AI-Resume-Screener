import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidate();
  }, [id]);

  const loadCandidate = async () => {
    try {
      const res = await api.get(`/candidate/${id}`);
      setCandidate(res.data);
    } catch (error) {
      console.error("Error loading candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div style={{ marginLeft: "270px", marginTop: "80px", padding: "30px", color: "white" }}>
          Loading...
        </div>
      </>
    );
  }

  if (!candidate || !candidate.success) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div style={{ marginLeft: "270px", marginTop: "80px", padding: "30px", color: "white" }}>
          <h2>Candidate not found</h2>
          <Link to="/ranking">Back to Rankings</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div
        style={{
          marginLeft: "270px",
          marginTop: "80px",
          padding: "30px",
          background: "#0f172a",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link
            to="/ranking"
            style={{
              color: "#6c63ff",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            ← Back to Rankings
          </Link>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "20px",
              padding: "40px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c63ff, #4a3fcf)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {candidate.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: "2rem", margin: 0 }}>{candidate.name}</h1>
                <p style={{ color: "#8a90a8", margin: "5px 0 0 0" }}>{candidate.email}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
              <div style={{ padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                <div style={{ color: "#8a90a8", fontSize: "0.85rem" }}>Phone</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{candidate.phone || "Not provided"}</div>
              </div>
              <div style={{ padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                <div style={{ color: "#8a90a8", fontSize: "0.85rem" }}>Match Score</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#6c63ff" }}>
                  {candidate.match_score}%
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#c4c9d6", marginBottom: "10px" }}>Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {candidate.skills && candidate.skills.length > 0 ? (
                  candidate.skills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "6px 16px",
                        background: "rgba(108, 99, 255, 0.15)",
                        borderRadius: "20px",
                        color: "#8b83ff",
                        fontSize: "0.85rem",
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#6a7084" }}>No skills listed</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#c4c9d6", marginBottom: "10px" }}>✅ Matched Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {candidate.matched_skills && candidate.matched_skills.length > 0 ? (
                  candidate.matched_skills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "6px 16px",
                        background: "rgba(0, 184, 148, 0.15)",
                        borderRadius: "20px",
                        color: "#00b894",
                        fontSize: "0.85rem",
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#6a7084" }}>No matched skills</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#c4c9d6", marginBottom: "10px" }}>❌ Missing Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
                  candidate.missing_skills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "6px 16px",
                        background: "rgba(239, 68, 68, 0.15)",
                        borderRadius: "20px",
                        color: "#ef4444",
                        fontSize: "0.85rem",
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#6a7084" }}>No missing skills</span>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ color: "#c4c9d6", marginBottom: "10px" }}>📄 Resume Text</h3>
              <div
                style={{
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "#c4c9d6",
                  whiteSpace: "pre-wrap",
                }}
              >
                {candidate.resume_text || "No resume text available"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CandidateDetails;