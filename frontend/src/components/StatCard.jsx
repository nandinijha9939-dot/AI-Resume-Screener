function StatCard({
  title,
  value,
  color = "#2563eb",
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "12px",
        padding: "25px",
        width: "250px",
        color: "white",
        boxShadow: "0 0 10px rgba(0,0,0,.3)",
      }}
    >
      <h3
        style={{
          color: "#94a3b8",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: color,
          fontSize: "34px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default StatCard;