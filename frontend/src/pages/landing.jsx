import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#ffffff" }}>
        <nav style={{ padding: "0 2.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, background: "#ffffff", zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#c2410c"/>
              <path d="M7 14h14M14 7l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", letterSpacing: "-0.3px" }}>EnviroTrack</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#374151", fontFamily: "'Inter', sans-serif" }}>Sign In</button>
            <button onClick={() => navigate("/signup")} style={{ background: "#c2410c", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>Get Started</button>
          </div>
        </nav>
        <section style={{ padding: "5rem 2.5rem 4rem", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#fff7ed", color: "#c2410c", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 20 }}>Civic Tech Platform</span>
            <h1 style={{ fontSize: 48, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-1px", margin: "0 0 20px" }}>
              Report Road Damage.<br /><span style={{ color: "#c2410c" }}>Get It Fixed Faster.</span>
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>A smart platform connecting citizens and authorities to identify, track, and resolve road damage in real time.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => navigate("/signup")} style={{ background: "#c2410c", border: "none", borderRadius: 10, padding: "14px 28px", cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>Citizen Portal</button>
              <button onClick={() => navigate("/login")} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 28px", cursor: "pointer", fontSize: 15, fontWeight: 500, color: "#374151", fontFamily: "'Inter', sans-serif" }}>Admin Dashboard</button>
            </div>
          </div>
          <div style={{ background: "#0f172a", borderRadius: 16, padding: 32, color: "#ffffff" }}>
            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.8px" }}>Platform Statistics</p>
            {[{ label: "Reports Submitted", value: "2,400+" }, { label: "Resolution Rate", value: "87%" }, { label: "Avg Response Time", value: "48 hrs" }].map((s, i) => (
              <div key={i} style={{ borderLeft: "3px solid #c2410c", paddingLeft: 16, marginBottom: i < 2 ? 20 : 0 }}>
                <p style={{ fontSize: 28, fontWeight: 700, margin: "0 0 2px" }}>{s.value}</p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>
        <section style={{ background: "#f8fafc", padding: "4rem 2.5rem", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 40, letterSpacing: "-0.5px" }}>How It Works</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                { step: "01", title: "Pin the Location", desc: "Use the interactive map to mark exactly where the damage is located." },
                { step: "02", title: "Describe & Upload", desc: "Add details about the damage type, severity, and attach a photo." },
                { step: "03", title: "Track Progress", desc: "Monitor the status of your report from pending to resolved." },
              ].map((f) => (
                <div key={f.step} style={{ background: "#ffffff", borderRadius: 12, padding: 28, border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", letterSpacing: "1px" }}>{f.step}</span>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "10px 0 8px" }}>{f.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <footer style={{ padding: "2rem 2.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>EnviroTrack</span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Built for smarter cities</span>
        </footer>
      </div>
    </>
  );
}
