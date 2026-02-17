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
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Smart Road System</div>
        <div className="nav-links">
          <button onClick={() => navigate("/login")}>Citizen</button>
          <button onClick={() => navigate("/admin-login")}>Admin</button>
        </div>
      </nav>

      {/* HERO CARD */}
      <div className="hero-wrapper">
        <div className="hero-card">
          <h1>
            Smart Road Damage Reporting & Rapid Response
          </h1>

          <p>
            Empowering Solapur Municipal Corporation with citizen-driven
            reporting, optimized repair routing, and measurable sustainability
            impact.
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

      {/* FEATURE CARDS */}
      <section className="cards-section">
        <div className="info-card">
          <div className="icon orange"></div>
          <h3>Live Damage Reporting</h3>
          <p>Upload pothole images with automatic GPS tagging.</p>
        </div>

        <div className="info-card">
          <div className="icon light-orange"></div>
          <h3>Heatmap Visualization</h3>
          <p>Authorities instantly see high-priority zones.</p>
        </div>

        <div className="info-card">
          <div className="icon dark-orange"></div>
          <h3>Optimized Routing</h3>
          <p>AI-based shortest path for fuel-efficient repairs.</p>
        </div>

        <div className="info-card">
          <div className="icon beige"></div>
          <h3>Before & After Verification</h3>
          <p>Digital evidence ensures repair accountability.</p>
        </div>
      </section>
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
    <h2 style={{ textAlign: "center", marginTop: "100px" }}>
      Admin Login Page
    </h2>
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
