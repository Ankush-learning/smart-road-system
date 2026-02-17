import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

/* ================= LANDING ================= */

function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Smart Road System
        </div>

        <div className="nav-links">
          <button onClick={() => navigate("/login")}>
            Citizen
          </button>

          <button onClick={() => navigate("/admin-login")}>
            Admin
          </button>
        </div>
      </nav>

      <div className="hero-wrapper">
        <div className="hero-card">
          <h1>Smart Road Damage Reporting & Rapid Response</h1>

          <p>
            Empowering Solapur Municipal Corporation with citizen-driven
            reporting, optimized repair routing, and measurable sustainability impact.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Report Road Damage
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/admin-login")}
            >
              Municipal Dashboard
            </button>
          </div>
        </div>
      </div>

      <section className="cards-section">
        <div className="info-card">
          <div className="icon orange"></div>
          <h3>Live Damage Reporting</h3>
          <p>Upload pothole images with automatic GPS tagging.</p>
        </div>

        <div className="info-card">
          <div className="icon soft-orange"></div>
          <h3>Heatmap Visualization</h3>
          <p>Authorities instantly see high-priority zones.</p>
        </div>

        <div className="info-card">
          <div className="icon deep-orange"></div>
          <h3>Optimized Routing</h3>
          <p>AI-based shortest path for fuel-efficient repairs.</p>
        </div>

        <div className="info-card">
          <div className="icon beige"></div>
          <h3>Before & After Verification</h3>
          <p>Digital evidence ensures repair accountability.</p>
        </div>
      </section>
    </>
  );
}

/* ================= CITIZEN LOGIN ================= */

function Login() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Smart Road System
        </div>
      </nav>

      <div style={{ textAlign: "center", marginTop: "150px" }}>
        <h2>Citizen Login</h2>

        <div style={{ marginTop: "40px" }}>
          <button
            style={{
              padding: "12px 24px",
              background: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
            onClick={() => navigate("/citizen")}
          >
            Login as Citizen (Demo)
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= ADMIN LOGIN ================= */

function AdminLogin() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Smart Road System
        </div>
      </nav>

      <div style={{ textAlign: "center", marginTop: "150px" }}>
        <h2>Admin Login</h2>

        <div style={{ marginTop: "40px" }}>
          <button
            style={{
              padding: "12px 24px",
              background: "#ea580c",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
            onClick={() => navigate("/admin")}
          >
            Login as Admin (Demo)
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= CITIZEN DASHBOARD ================= */

function CitizenDashboard() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">Smart Road System</div>
      </nav>

      <div style={{ padding: "60px" }}>
        <h2>Citizen Dashboard</h2>
        <p style={{ marginTop: "20px" }}>
          Map and damage reporting section will go here.
        </p>
      </div>
    </>
  );
}

/* ================= ADMIN DASHBOARD ================= */

function AdminDashboard() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">Smart Road System</div>
      </nav>

      <div style={{ padding: "60px" }}>
        <h2>Admin Dashboard</h2>
        <p style={{ marginTop: "20px" }}>
          Heatmap and routing system will go here.
        </p>
      </div>
    </>
  );
}

/* ================= MAIN APP ================= */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
