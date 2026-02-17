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
  return <h2 style={{textAlign:"center", marginTop:"100px"}}>Admin Login Page</h2>;
}

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



