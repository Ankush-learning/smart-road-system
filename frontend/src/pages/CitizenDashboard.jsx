import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) { onSelect(e.latlng); }
  });
  return null;
}

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("report"); // "report" | "myreports"
  const [position, setPosition] = useState(null);
  const [form, setForm] = useState({ damageType: "POTHOLE", severity: "MEDIUM", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myReports, setMyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) { alert("Please click on the map to select a location."); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({
        ...form, latitude: position.lat, longitude: position.lng
      })], { type: "application/json" }));
      if (image) formData.append("image", image);

      await API.post("/citizen/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(true);
      setPosition(null);
      setForm({ damageType: "POTHOLE", severity: "MEDIUM", description: "" });
      setImage(null);
      setPreview(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadMyReports = async () => {
    setLoadingReports(true);
    try {
      const res = await API.get("/citizen/reports/my");
      setMyReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (tab === "myreports") loadMyReports();
  }, [tab]);

  const severityColor = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#ef4444" };
  const statusColor   = { PENDING: "#6b7280", IN_PROGRESS: "#3b82f6", RESOLVED: "#22c55e" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🛣️</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>RoadWatch</span>
          <span style={{ background: "#fff7ed", color: "#ea580c", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, marginLeft: 8 }}>CITIZEN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#64748b", fontSize: 14 }}>👋 {user?.fullName}</span>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 16px", cursor: "pointer", color: "#64748b", fontSize: 14 }}>Logout</button>
        </div>
      </nav>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 2rem", display: "flex", gap: 0 }}>
        {[["report", "📍 Report Damage"], ["myreports", "📋 My Reports"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "14px 24px", border: "none", borderBottom: tab === key ? "2px solid #ea580c" : "2px solid transparent", background: "none", cursor: "pointer", fontWeight: tab === key ? 600 : 400, color: tab === key ? "#ea580c" : "#64748b", fontSize: 14 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Report Tab */}
        {tab === "report" && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1e293b", marginBottom: 4 }}>Report Road Damage</h2>
            <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>Click on the map to mark the damage location, then fill in the details.</p>

            {success && (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#16a34a", fontWeight: 600 }}>
                ✅ Report submitted successfully!
              </div>
            )}

            {/* Map */}
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 24, border: "1px solid #e2e8f0" }}>
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: 380, width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onSelect={setPosition} />
                {position && <Marker position={position} />}
              </MapContainer>
            </div>
            {position ? (
              <p style={{ color: "#16a34a", fontSize: 13, marginBottom: 16 }}>📍 Location selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</p>
            ) : (
              <p style={{ color: "#f59e0b", fontSize: 13, marginBottom: 16 }}>⚠️ Click on the map to select a damage location</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Damage Type</label>
                  <select value={form.damageType} onChange={e => setForm(p => ({ ...p, damageType: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
                    <option value="POTHOLE">🕳️ Pothole</option>
                    <option value="CRACK">〰️ Road Crack</option>
                    <option value="WATERLOGGING">💧 Waterlogging</option>
                    <option value="OTHER">⚠️ Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Severity</label>
                  <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
                    <option value="LOW">🟢 Low</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HIGH">🔴 High</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the damage..." rows={3}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Photo (optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  style={{ fontSize: 14, color: "#374151" }} />
                {preview && <img src={preview} alt="preview" style={{ marginTop: 10, height: 120, borderRadius: 8, objectFit: "cover" }} />}
              </div>

              <button type="submit" disabled={submitting || !position}
                style={{ background: submitting || !position ? "#d1d5db" : "#ea580c", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 15, cursor: submitting || !position ? "not-allowed" : "pointer" }}>
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        )}

        {/* My Reports Tab */}
        {tab === "myreports" && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1e293b", marginBottom: 24 }}>My Reports</h2>
            {loadingReports ? (
              <p style={{ color: "#64748b" }}>Loading...</p>
            ) : myReports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p>No reports yet. Go report some road damage!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {myReports.map(r => (
                  <div key={r.id} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0", display: "flex", gap: 16 }}>
                    {r.imageUrl && <img src={r.imageUrl} alt="damage" style={{ width: 100, height: 80, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ background: "#fff7ed", color: "#ea580c", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>{r.damageType}</span>
                        <span style={{ background: "#f8fafc", color: severityColor[r.severity], fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 20, border: `1px solid ${severityColor[r.severity]}` }}>{r.severity}</span>
                        <span style={{ background: "#f8fafc", color: statusColor[r.status], fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 20, border: `1px solid ${statusColor[r.status]}` }}>{r.status}</span>
                      </div>
                      <p style={{ color: "#374151", fontSize: 14, margin: "0 0 4px" }}>{r.description || "No description"}</p>
                      <p style={{ color: "#94a3b8", fontSize: 12 }}>📍 {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)} · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
