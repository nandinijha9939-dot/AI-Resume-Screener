import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaMedal, FaTrophy, FaAward, FaUserGraduate } from "react-icons/fa";
import { MdVerified, MdTrendingUp, MdTrendingDown } from "react-icons/md";

function CandidateTable({ candidates = [], loading }) {
  // Get rank badge
  const getRankBadge = (rank) => {
    if (rank === 1) {
      return { icon: <FaTrophy />, color: "#ffd700", label: "Gold", bg: "rgba(255, 215, 0, 0.15)" };
    } else if (rank === 2) {
      return { icon: <FaMedal />, color: "#c0c0c0", label: "Silver", bg: "rgba(192, 192, 192, 0.15)" };
    } else if (rank === 3) {
      return { icon: <FaAward />, color: "#cd7f32", label: "Bronze", bg: "rgba(205, 127, 50, 0.15)" };
    } else {
      return { icon: <FaUserGraduate />, color: "#6c63ff", label: `#${rank}`, bg: "rgba(108, 99, 255, 0.1)" };
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "#00b894";
    if (score >= 60) return "#f59e0b";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  // Get score label
  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '60px 20px', 
        gap: '16px', 
        color: '#8a90a8' 
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          border: '3px solid rgba(108, 99, 255, 0.1)', 
          borderTopColor: '#6c63ff', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <p>Loading candidates...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Stats Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        padding: '16px 24px', 
        background: 'rgba(255, 255, 255, 0.03)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#8a90a8', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</span>
          <span style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700 }}>{candidates.length}</span>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.08)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#8a90a8', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Score</span>
          <span style={{ color: '#00b894', fontSize: '1.1rem', fontWeight: 700 }}>
            {candidates.length > 0 ? Math.max(...candidates.map(c => c.match_score)).toFixed(1) + "%" : "0%"}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.08)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#8a90a8', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average</span>
          <span style={{ color: '#f59e0b', fontSize: '1.1rem', fontWeight: 700 }}>
            {candidates.length > 0 
              ? (candidates.reduce((sum, c) => sum + c.match_score, 0) / candidates.length).toFixed(1) + "%"
              : "0%"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', padding: '0 4px' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontSize: '0.9rem',
          color: '#e4e6eb'
        }}>
          <thead style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <tr>
              <th style={{ padding: '16px 18px', textAlign: 'left', color: '#8a90a8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10, width: '80px' }}>Rank</th>
              <th style={{ padding: '16px 18px', textAlign: 'left', color: '#8a90a8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10, width: '200px' }}>Candidate</th>
              <th style={{ padding: '16px 18px', textAlign: 'left', color: '#8a90a8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10, width: '200px' }}>Email</th>
              <th style={{ padding: '16px 18px', textAlign: 'left', color: '#8a90a8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10, width: '200px' }}>Skills</th>
              <th style={{ padding: '16px 18px', textAlign: 'left', color: '#8a90a8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10, width: '140px' }}>Score</th>
              <th style={{ padding: '16px 18px', textAlign: 'left', color: '#8a90a8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10, width: '130px' }}>Status</th>
              <th style={{ padding: '16px 18px', textAlign: 'left', color: '#8a90a8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10, width: '130px' }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div>
                    <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.6 }}>📭</div>
                    <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '8px' }}>No Candidates Yet</h3>
                    <p style={{ color: '#6a7084', marginBottom: '20px' }}>Upload resumes to start screening</p>
                    <Link to="/upload" style={{ 
                      display: 'inline-block', 
                      padding: '12px 30px', 
                      background: 'linear-gradient(135deg, #6c63ff, #4a3fcf)', 
                      borderRadius: '12px', 
                      color: 'white', 
                      textDecoration: 'none', 
                      fontWeight: 600,
                      transition: 'all 0.3s ease'
                    }}>
                      Upload Resume
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {candidates.map((candidate, index) => {
                  const rankBadge = getRankBadge(candidate.rank);
                  const scoreColor = getScoreColor(candidate.match_score);
                  const scoreLabel = getScoreLabel(candidate.match_score);
                  
                  return (
                    <motion.tr
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.002,
                        backgroundColor: "rgba(108, 99, 255, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                    >
                      {/* Rank */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '4px 12px 4px 8px', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          border: `1px solid ${rankBadge.color}`,
                          background: rankBadge.bg,
                          whiteSpace: 'nowrap'
                        }}>
                          <span style={{ color: rankBadge.color }}>{rankBadge.icon}</span>
                          <span>{rankBadge.label}</span>
                        </div>
                      </td>

                      {/* Name */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(108, 99, 255, 0.05))', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 700, 
                            fontSize: '0.9rem', 
                            color: '#6c63ff', 
                            flexShrink: 0, 
                            border: '2px solid rgba(108, 99, 255, 0.15)' 
                          }}>
                            {candidate.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>  {candidate.name || candidate.full_name || "Unknown"}</div>
                            {candidate.match_score >= 80 && (
                              <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                fontSize: '0.65rem', 
                                color: '#00b894', 
                                background: 'rgba(0, 184, 148, 0.12)', 
                                padding: '2px 10px', 
                                borderRadius: '12px', 
                                marginTop: '2px' 
                              }}>
                                <MdVerified /> Top Match
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <a href={`mailto:${candidate.email}`} style={{ 
                          color: '#8a90a8', 
                          textDecoration: 'none', 
                          transition: 'color 0.3s ease', 
                          fontSize: '0.85rem' 
                        }}>
                          {candidate.email}
                        </a>
                      </td>

                      {/* Skills */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                          {candidate.matched_skills && candidate.matched_skills.length > 0 ? (
                            candidate.matched_skills.slice(0, 3).map((skill, i) => (
                              <span key={i} style={{ 
                                display: 'inline-block', 
                                padding: '2px 10px', 
                                borderRadius: '12px', 
                                fontSize: '0.7rem', 
                                fontWeight: 500, 
                                background: 'rgba(108, 99, 255, 0.12)', 
                                color: '#8b83ff', 
                                border: '1px solid rgba(108, 99, 255, 0.08)',
                                maxWidth: '100px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#6a7084', fontSize: '0.75rem', fontStyle: 'italic' }}>No skills listed</span>
                          )}
                          {candidate.matched_skills && candidate.matched_skills.length > 3 && (
                            <span style={{ 
                              fontSize: '0.7rem', 
                              color: '#8a90a8', 
                              padding: '2px 8px', 
                              background: 'rgba(255, 255, 255, 0.03)', 
                              borderRadius: '12px' 
                            }}>
                              +{candidate.matched_skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Score */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: `conic-gradient(${scoreColor} ${candidate.match_score}%, rgba(255,255,255,0.05) 0%)`,
                            flexShrink: 0
                          }}>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 700, 
                              background: '#0a0e1a', 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: scoreColor
                            }}>
                              {candidate.match_score}%
                            </span>
                          </div>
                          <div style={{ width: '80px', height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${candidate.match_score}%`, 
                              height: '100%', 
                              borderRadius: '4px',
                              background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}dd)`,
                              transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}></div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.7rem', 
                          fontWeight: 600, 
                          whiteSpace: 'nowrap',
                          background: candidate.match_score >= 80 
                            ? 'rgba(0, 184, 148, 0.15)' 
                            : candidate.match_score >= 60 
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                          color: scoreColor,
                        }}>
                          {candidate.match_score >= 80 && <MdTrendingUp />}
                          {candidate.match_score >= 60 && candidate.match_score < 80 && <MdTrendingUp />}
                          {candidate.match_score < 60 && <MdTrendingDown />}
                          {scoreLabel}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <Link to={`/candidate/${candidate.id}`} style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '6px 16px', 
                          background: 'rgba(108, 99, 255, 0.1)', 
                          border: '1px solid rgba(108, 99, 255, 0.15)', 
                          borderRadius: '10px', 
                          color: '#8b83ff', 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          textDecoration: 'none', 
                          transition: 'all 0.3s ease', 
                          whiteSpace: 'nowrap' 
                        }}>
                          <FaEye />
                          View Profile
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {candidates.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 24px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          color: '#8a90a8', 
          fontSize: '0.85rem',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span>Showing {candidates.length} candidates</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ 
              padding: '6px 16px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '8px', 
              color: '#c4c9d6', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease', 
              fontSize: '0.8rem' 
            }}>Previous</button>
            <span style={{ color: '#6a7084', fontSize: '0.8rem' }}>Page 1 of 1</span>
            <button style={{ 
              padding: '6px 16px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '8px', 
              color: '#c4c9d6', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease', 
              fontSize: '0.8rem' 
            }}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateTable;