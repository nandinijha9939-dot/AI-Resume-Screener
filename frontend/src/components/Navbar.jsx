import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav style={{
      background: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "15px 30px",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10000,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#6c63ff" }}>
          🤖 AI Screener
        </span>
        
        <div style={{ display: "flex", gap: "15px", marginLeft: "30px" }}>
          <Link to="/" style={{
            color: location.pathname === "/" ? "#ffffff" : "#8a90a8",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "10px",
            background: location.pathname === "/" ? "rgba(108, 99, 255, 0.15)" : "transparent",
          }}>
            Dashboard
          </Link>
          <Link to="/upload-job" style={{
            color: location.pathname === "/upload-job" ? "#ffffff" : "#8a90a8",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "10px",
            background: location.pathname === "/upload-job" ? "rgba(108, 99, 255, 0.15)" : "transparent",
          }}>
            Upload Job
          </Link>
          <Link to="/upload" style={{
            color: location.pathname === "/upload" ? "#ffffff" : "#8a90a8",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "10px",
            background: location.pathname === "/upload" ? "rgba(108, 99, 255, 0.15)" : "transparent",
          }}>
            Upload Resume
          </Link>
          <Link to="/ranking" style={{
            color: location.pathname === "/ranking" ? "#ffffff" : "#8a90a8",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "10px",
            background: location.pathname === "/ranking" ? "rgba(108, 99, 255, 0.15)" : "transparent",
          }}>
            Ranking
          </Link>
        </div>
      </div>

      <div style={{ color: "#8a90a8", fontSize: "0.9rem" }}>
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}
      </div>
    </nav>
  );
}

export default Navbar;