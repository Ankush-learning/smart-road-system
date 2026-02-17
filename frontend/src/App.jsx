import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "32px",
      fontWeight: "bold"
    }}>
      SMART ROAD SYSTEM LIVE
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
