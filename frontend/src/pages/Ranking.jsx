import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CandidateTable from "../components/CandidateTable";
import api from "../services/api";

function Ranking() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ranking");
      setCandidates(res.data);
    } catch (err) {
      console.log(err);
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
        {/* Page Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: 700,
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            🏆 Candidate Ranking
          </h1>
          <p style={{ color: "#8a90a8", fontSize: "1rem" }}>
            AI-ranked candidates based on job description match
          </p>
        </div>

        {/* Ranking Table Only */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "20px",
            padding: "25px",
            overflow: "hidden",
          }}
        >
          <CandidateTable candidates={candidates} loading={loading} />
        </div>
      </div>
    </>
  );
}

export default Ranking;