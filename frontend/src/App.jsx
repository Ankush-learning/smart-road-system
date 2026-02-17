import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Smart Road Damage Reporting
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          A citizen-powered digital governance system that enables fast,
          transparent and efficient municipal road maintenance.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Citizen Portal
          </button>

          <button
            onClick={() => navigate("/admin-login")}
            className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg transition"
          >
            Municipal Dashboard
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">

          <div className="p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-3">📍 Real-Time Reporting</h3>
            <p className="text-gray-600">
              Citizens can instantly report potholes and damaged roads with
              live location tracking.
            </p>
          </div>

          <div className="p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-3">🗺 Interactive Map</h3>
            <p className="text-gray-600">
              Visualize reported issues across the city using dynamic map-based views.
            </p>
          </div>

          <div className="p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-3">⚡ Fast Municipal Action</h3>
            <p className="text-gray-600">
              Administrators track, assign and resolve road complaints efficiently.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

function Login() {
  return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Citizen Login Page</h2>;
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

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button>Login</button>
      </div>
    </div>
  );
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

