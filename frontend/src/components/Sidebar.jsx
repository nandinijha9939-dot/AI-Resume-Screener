import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <div style={{
      width: "250px",
      height: "100vh",
      background: "rgba(15, 23, 42, 0.95)",  // ← Darker background
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "20px",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 9999,  // ← Higher z-index
      overflowY: "auto",
      boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)",  // ← Add shadow
    }}>
      <div style={{ marginBottom: "30px", padding: "10px" }}>
        <h2 style={{ color: "#6c63ff", fontSize: "1.3rem" }}>🤖 AI Screener</h2>
      </div>

      <nav>
        <Link to="/" style={{
          display: "block",
          padding: "12px 16px",
          marginBottom: "8px",
          borderRadius: "12px",
          color: location.pathname === "/" ? "#ffffff" : "#8a90a8",
          background: location.pathname === "/" ? "rgba(108, 99, 255, 0.2)" : "transparent",
          textDecoration: "none",
          transition: "all 0.3s ease",
        }}>
          📊 Dashboard
        </Link>

        <Link to="/upload" style={{
          display: "block",
          padding: "12px 16px",
          marginBottom: "8px",
          borderRadius: "12px",
          color: location.pathname === "/upload" ? "#ffffff" : "#8a90a8",
          background: location.pathname === "/upload" ? "rgba(108, 99, 255, 0.2)" : "transparent",
          textDecoration: "none",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}>
          📤 Upload Resume
        </Link>

        <Link to="/ranking" style={{
          display: "block",
          padding: "12px 16px",
          marginBottom: "8px",
          borderRadius: "12px",
          color: location.pathname === "/ranking" ? "#ffffff" : "#8a90a8",
          background: location.pathname === "/ranking" ? "rgba(108, 99, 255, 0.2)" : "transparent",
          textDecoration: "none",
          transition: "all 0.3s ease",
        }}>
          🏆 Ranking
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;