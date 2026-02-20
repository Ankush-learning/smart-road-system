import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const data = await register(form.fullName, form.email, form.password);
      navigate(data.role === "ADMIN" ? "/admin" : "/citizen");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1px solid #d1d5db", fontSize: 14,
    fontFamily: "'Inter', sans-serif", color: "#0f172a",
    outline: "none", boxSizing: "border-box", background: "#ffffff",
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#ffffff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 440, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, cursor: "pointer" }} onClick={() => navigate("/")}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#c2410c"/>
              <path d="M7 14h14M14 7l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>RoadWatch</span>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.3px" }}>Create your account</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>Start reporting road damage in your area</p>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#b91c1c", fontSize: 13, fontWeight: 500 }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Full name</label>
              <input name="fullName" type="text" autoComplete="name" placeholder="Ankush T"
                value={form.fullName} onChange={handleChange} disabled={loading} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email address</label>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} disabled={loading} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
              <input name="password" type="password" autoComplete="new-password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} disabled={loading} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Confirm password</label>
              <input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter password"
                value={form.confirmPassword} onChange={handleChange} disabled={loading} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading}
              style={{ background: loading ? "#d1d5db" : "#c2410c", color: "#ffffff", border: "none", borderRadius: 8, padding: "12px", fontWeight: 600, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", marginTop: 4 }}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", marginTop: 20, marginBottom: 0 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#c2410c", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
