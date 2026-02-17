import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./index.css";

/* ---------------- LANDING ---------------- */

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="hero">
        <h1>Smart Road Damage Reporting</h1>
        <p>
          A citizen-powered digital governance platform enabling fast,
          transparent and efficient municipal road maintenance.
        </p>

        <div className="buttons">
          <button className="primary" onClick={() => navigate("/login")}>
            Citizen Portal
          </button>

          <button
            className="secondary"
            onClick={() => navigate("/admin-login")}
          >
            Municipal Dashboard
          </button>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>📍 Real-Time Reporting</h3>
            <p>Instantly report potholes with live location tracking.</p>
          </div>

          <div className="feature-card">
            <h3>🗺 Interactive Map</h3>
            <p>Visualize reported issues across the city dynamically.</p>
          </div>

          <div className="feature-card">
            <h3>⚡ Fast Municipal Action</h3>
            <p>Track, assign and resolve complaints efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */

function Login() {
  return (
    <h2 style={{ textAlign: "center", marginTop: "100px" }}>
      Citizen Login Page
    </h2>
  );
}

/* ---------------- ADMIN LOGIN ---------------- */

function AdminLogin() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#f97316",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
