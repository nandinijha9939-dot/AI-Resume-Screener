import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaTrophy, FaChartLine, FaSpinner } from "react-icons/fa";
import { MdDashboard, MdUpload, MdBarChart } from "react-icons/md";
import api from "../services/api";
import CandidateTable from "../components/CandidateTable";
import Navbar from "../components/Navbar";  // ← ADD THIS
import Sidebar from "../components/Sidebar";  // ← ADD THIS
import "./Dashboard.css";

function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ranking");
      setCandidates(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = candidates.length;
  const highest = total > 0 ? Math.max(...candidates.map(c => c.match_score)) : 0;
  const average = total > 0 ? candidates.reduce((sum, c) => sum + c.match_score, 0) / total : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <Navbar />  {/* ← ADD THIS */}
      <Sidebar />  {/* ← ADD THIS */}
      
      <div className="dashboard-wrapper" style={{ marginLeft: "270px", marginTop: "80px" }}>
        {/* Animated Background */}
        <div className="dashboard-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="dashboard-content">
          {/* Header Section */}
          <motion.div 
            className="dashboard-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="header-left">
              <div className="header-icon">
                <MdDashboard />
              </div>
              <div>
                <h1 className="dashboard-title">
                  Dashboard
                  <span className="title-badge">AI Powered</span>
                </h1>
                <p className="dashboard-subtitle">
                  Real-time insights and analytics for your recruitment pipeline
                </p>
              </div>
            </div>
            <div className="header-right">
              <button className="btn-refresh" onClick={loadCandidates}>
                <FaSpinner className={loading ? "spin" : ""} />
                Refresh
              </button>
              <div className="date-display">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div 
            className="quick-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="nav-pills">
              <button className="nav-pill active" onClick={() => window.location.href = '/'}>
                <MdDashboard /> Overview
              </button>
              <button className="nav-pill" onClick={() => window.location.href = '/upload'}>
                <MdUpload /> Upload
              </button>
              <button className="nav-pill" onClick={() => window.location.href = '/ranking'}>
                <MdBarChart /> Rankings
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="stats-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Candidates"
                value={total}
                icon={<FaUsers />}
                color="#6c63ff"
                gradient="linear-gradient(135deg, #6c63ff, #4a3fcf)"
                subtitle={`${total > 0 ? 'Active applicants' : 'No applications yet'}`}
                loading={loading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatCard
                title="Highest Score"
                value={`${highest.toFixed(1)}%`}
                icon={<FaTrophy />}
                color="#00b894"
                gradient="linear-gradient(135deg, #00b894, #00a381)"
                subtitle={highest > 80 ? '🌟 Excellent match!' : 'Keep reviewing'}
                loading={loading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatCard
                title="Average Score"
                value={`${average.toFixed(1)}%`}
                icon={<FaChartLine />}
                color="#f59e0b"
                gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                subtitle={`Based on ${total} candidates`}
                loading={loading}
              />
            </motion.div>
          </motion.div>

          {/* Table Section */}
          <motion.div 
            className="table-section"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="table-header">
              <div className="table-header-left">
                <h2>📊 Candidate Rankings</h2>
                <span className="candidate-count">{total} candidates</span>
              </div>
              <div className="table-header-right">
                <button className="btn-filter">Filter</button>
                <button className="btn-export">Export</button>
              </div>
            </div>

            {error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={loadCandidates}>Try Again</button>
              </div>
            ) : (
              <CandidateTable candidates={candidates} loading={loading} />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

// ===== StatCard Component =====
function StatCard({ title, value, icon, color, gradient, subtitle, loading }) {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-card-header">
        <span className="stat-icon" style={{ color }}>
          {icon}
        </span>
        <span className="stat-badge">+12%</span>
      </div>
      <div className="stat-value">
        {loading ? (
          <span className="stat-loading">...</span>
        ) : (
          value
        )}
      </div>
      <div className="stat-title">{title}</div>
      <div className="stat-subtitle">{subtitle}</div>
      <div className="stat-progress">
        <div 
          className="stat-progress-fill" 
          style={{ 
            width: typeof value === 'string' ? value.replace('%', '') : Math.min(value * 5, 100) + '%',
            background: gradient 
          }}
        ></div>
      </div>
    </div>
  );
}

export default Dashboard;