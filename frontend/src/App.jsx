import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="hero">
        <h1>SMART ROAD DAMAGE REPORTING SYSTEM</h1>
        <p>
          A citizen-driven smart governance platform for rapid municipal response.
        </p>
        <div className="buttons">
          <button
            className="primary"
            onClick={() => navigate("/login")}
          >
            Citizen Portal
          </button>

          <button
            className="secondary"
            onClick={() => navigate("/admin-login")}
          >
            Municipal Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function Login() {
  return <h2 style={{textAlign:"center", marginTop:"100px"}}>Citizen Login Page</h2>;
}

function AdminLogin() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        width: "350px"
      }}>
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
            border: "1px solid #ccc"
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
            border: "1px solid #ccc"
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
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
