import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Smart Road Damage Reporting System</h1>
        <p style={styles.subtitle}>
          Report potholes instantly. Track complaints transparently.
          Empower citizens. Improve cities.
        </p>

        <div style={styles.buttonGroup}>
          <Link to="/login">
            <button style={styles.primaryBtn}>Login</button>
          </Link>

          <Link to="/register">
            <button style={styles.secondaryBtn}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    color: "#000000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  hero: {
    textAlign: "center",
    maxWidth: "800px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "40px",
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  primaryBtn: {
    padding: "12px 28px",
    fontSize: "16px",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px 28px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "2px solid #000000",
    cursor: "pointer",
  },
};
