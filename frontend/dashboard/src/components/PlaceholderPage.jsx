/**
 * PlaceholderPage — shared shell for any section not yet built.
 * Keeps the sidebar/routing structure fully navigable from day one,
 * while making it obvious (to us and to anyone reviewing the repo)
 * exactly which sections are live vs planned.
 */
function PlaceholderPage({ title, description }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>{description}</p>
      <div style={styles.badge}>🚧 Planned — not yet built</div>
    </div>
  );
}

const styles = {
  container: { padding: "40px" },
  title: { color: "#fff", fontSize: "24px", margin: "0 0 8px 0" },
  description: { color: "#888", fontSize: "14px", marginBottom: "20px" },
  badge: {
    display: "inline-block",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "8px 16px",
    color: "#facc15",
    fontSize: "13px",
  },
};

export default PlaceholderPage;