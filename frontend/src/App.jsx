import API from "./api";
import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";


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

      {/* HERO SECTION */}
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

      {/* FEATURE CARDS */}
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


/* ================= LOGIN ================= */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/citizen");
      }

    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

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

      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h2>Login</h2>

        <div style={{ marginTop: "30px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <br />

          <button
            onClick={handleLogin}
            style={{
              padding: "12px 30px",
              background: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Login
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "15px" }}>
              {error}
            </p>
          )}
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
        <p>Map and damage reporting section will go here.</p>
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
        <p>Heatmap and routing system will go here.</p>
      </div>
    </>
  );
}

/* ================= MAIN APP ================= */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
    <Route
  path="/citizen"
  element={
    <ProtectedRoute>
      <CitizenDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
