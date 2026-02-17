import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

function Landing() {
  return (
    <div className="landing">
      <div className="hero">
        <h1>SMART ROAD DAMAGE REPORTING SYSTEM</h1>
        <p>
          A citizen-driven smart governance platform for rapid municipal response.
        </p>
        <div className="buttons">
          <button className="primary">Citizen Portal</button>
          <button className="secondary">Municipal Dashboard</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;


