import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ onSelect }) {
  useMapEvents({ click(e) { onSelect(e.latlng); } });
  return null;
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "'Inter', sans-serif",
  },
  nav: {
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoText: { fontWeight: 700, fontSize: 18, color: "#0f172a", letterSpacing: "-0.3px" },
  badge: {
    background: "#fff7ed", color: "#c2410c", fontSize: 10,
    fontWeight: 700, padding: "2px 8px", borderRadius: 20,
    letterSpacing: "0.5px", textTransform: "uppercase",
  },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  greeting: { color: "#64748b", fontSize: 14 },
  logoutBtn: {
    background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
    padding: "6px 16px", cursor: "pointer", color: "#64748b",
    fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500,
    transition: "all 0.15s",
  },
  tabs: {
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 2rem",
    display: "flex",
  },
  tab: (active) => ({
    padding: "14px 24px", border: "none",
    borderBottom: active ? "2px solid #c2410c" : "2px solid transparent",
    background: "none", cursor: "pointer",
    fontWeight: active ? 600 : 400,
    color: active ? "#c2410c" : "#64748b",
    fontSize: 14, fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s",
  }),
  container: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
  pageHeader: { marginBottom: 24 },
  pageTitle: { fontWeight: 700, fontSize: 22, color: "#0f172a", margin: "0 0 4px" },
  pageSubtitle: { color: "#64748b", fontSize: 14, margin: 0 },
  splitLayout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" },
  card: {
    background: "#ffffff", borderRadius: 12,
    border: "1px solid #e2e8f0", overflow: "hidden",
  },
  cardHeader: { padding: "16px 20px", borderBottom: "1px solid #f1f5f9" },
  cardTitle: { fontWeight: 600, fontSize: 15, color: "#0f172a", margin: 0 },
  cardBody: { padding: 20 },
  locationHint: (hasPos) => ({
    padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
    marginTop: 12,
    background: hasPos ? "#f0fdf4" : "#fffbeb",
    color: hasPos ? "#15803d" : "#b45309",
    border: `1px solid ${hasPos ? "#bbf7d0" : "#fde68a"}`,
  }),
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  select: {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1px solid #d1d5db", fontSize: 14,
    fontFamily: "'Inter', sans-serif", color: "#0f172a",
    background: "#ffffff", cursor: "pointer",
    outline: "none",
  },
  textarea: {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1px solid #d1d5db", fontSize: 14,
    fontFamily: "'Inter', sans-serif", resize: "vertical",
    color: "#0f172a", outline: "none", boxSizing: "border-box",
  },
  fileInput: { fontSize: 13, color: "#374151", fontFamily: "'Inter', sans-serif" },
  preview: { marginTop: 10, height: 100, borderRadius: 8, objectFit: "cover", width: "100%" },
  submitBtn: (disabled) => ({
    width: "100%", background: disabled ? "#e2e8f0" : "#c2410c",
    color: disabled ? "#94a3b8" : "#ffffff", border: "none",
    borderRadius: 8, padding: "12px 0", fontWeight: 600,
    fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Inter', sans-serif", marginTop: 8,
    transition: "background 0.15s",
  }),
  successBanner: {
    background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10,
    padding: "12px 16px", marginBottom: 20, color: "#15803d",
    fontWeight: 600, fontSize: 14,
  },
  reportCard: {
    background: "#ffffff", borderRadius: 12, padding: 20,
    border: "1px solid #e2e8f0", display: "flex", gap: 16,
  },
  reportImg: { width: 90, height: 72, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  chipRow: { display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" },
  chip: (color, bg) => ({
    background: bg, color: color, fontSize: 11, fontWeight: 700,
    padding: "3px 10px", borderRadius: 20, letterSpacing: "0.3px",
    textTransform: "uppercase",
  }),
  emptyState: { textAlign: "center", padding: "4rem 2rem", color: "#94a3b8" },
  emptyIcon: { fontSize: 40, marginBottom: 12, color: "#cbd5e1" },
};

const severityConfig = {
  LOW:    { color: "#15803d", bg: "#dcfce7" },
  MEDIUM: { color: "#b45309", bg: "#fef3c7" },
  HIGH:   { color: "#b91c1c", bg: "#fee2e2" },
};
const statusConfig = {
  PENDING:     { color: "#6b7280", bg: "#f3f4f6" },
  IN_PROGRESS: { color: "#1d4ed8", bg: "#dbeafe" },
  RESOLVED:    { color: "#15803d", bg: "#dcfce7" },
};

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("report");
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
        ...form, latitude: position.lat, longitude: position.lng,
      })], { type: "application/json" }));
      if (image) formData.append("image", image);
      await API.post("/citizen/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setPosition(null);
      setForm({ damageType: "POTHOLE", severity: "MEDIUM", description: "" });
      setImage(null);
      setPreview(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
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

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={styles.page}>
        {/* Navbar */}
        <nav style={styles.nav}>
          <div style={styles.navLeft} onClick={() => navigate("/")}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#c2410c"/>
              <path d="M7 14h14M14 7l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={styles.logoText}>RoadWatch</span>
            <span style={styles.badge}>Citizen</span>
          </div>
          <div style={styles.navRight}>
            <span style={styles.greeting}>Welcome, {user?.fullName?.split(" ")[0]}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
          </div>
        </nav>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={styles.tab(tab === "report")} onClick={() => setTab("report")}>Report Damage</button>
          <button style={styles.tab(tab === "myreports")} onClick={() => setTab("myreports")}>My Reports</button>
        </div>

        <div style={styles.container}>

          {/* Report Tab */}
          {tab === "report" && (
            <div>
              <div style={styles.pageHeader}>
                <h2 style={styles.pageTitle}>Report Road Damage</h2>
                <p style={styles.pageSubtitle}>Click on the map to pin the damage location, then fill in the details.</p>
              </div>

              {success && (
                <div style={styles.successBanner}>Report submitted successfully.</div>
              )}

              <div style={styles.splitLayout}>
                {/* Left — Map */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <p style={styles.cardTitle}>Select Location</p>
                  </div>
                  <div style={styles.cardBody}>
                    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: 340, width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker onSelect={setPosition} />
                        {position && <Marker position={position} />}
                      </MapContainer>
                    </div>
                    <p style={styles.locationHint(!!position)}>
                      {position
                        ? `Location selected: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
                        : "No location selected — click anywhere on the map"}
                    </p>
                  </div>
                </div>

                {/* Right — Form */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <p style={styles.cardTitle}>Damage Details</p>
                  </div>
                  <div style={styles.cardBody}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Damage Type</label>
                        <select style={styles.select} value={form.damageType}
                          onChange={e => setForm(p => ({ ...p, damageType: e.target.value }))}>
                          <option value="POTHOLE">Pothole</option>
                          <option value="CRACK">Road Crack</option>
                          <option value="WATERLOGGING">Waterlogging</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Severity</label>
                        <select style={styles.select} value={form.severity}
                          onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea style={styles.textarea} rows={4}
                          placeholder="Describe the damage in detail..."
                          value={form.description}
                          onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Photo (optional)</label>
                        <input type="file" accept="image/*" style={styles.fileInput}
                          onChange={handleImageChange} />
                        {preview && <img src={preview} alt="preview" style={styles.preview} />}
                      </div>

                      <button type="submit"
                        style={styles.submitBtn(submitting || !position)}
                        disabled={submitting || !position}>
                        {submitting ? "Submitting..." : "Submit Report"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Reports Tab */}
          {tab === "myreports" && (
            <div>
              <div style={styles.pageHeader}>
                <h2 style={styles.pageTitle}>My Reports</h2>
                <p style={styles.pageSubtitle}>All damage reports you have submitted.</p>
              </div>
              {loadingReports ? (
                <p style={{ color: "#64748b", fontSize: 14 }}>Loading reports...</p>
              ) : myReports.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                      <path d="M9 12h6M9 16h6M7 4H4a1 1 0 00-1 1v15a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1h-3M9 4a1 1 0 011-1h4a1 1 0 011 1v0a1 1 0 01-1 1H10a1 1 0 01-1-1v0z"/>
                    </svg>
                  </div>
                  <p style={{ fontWeight: 600, color: "#475569", marginBottom: 4 }}>No reports yet</p>
                  <p style={{ fontSize: 13 }}>Switch to the Report Damage tab to submit your first report.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myReports.map(r => {
                    const sev = severityConfig[r.severity] || severityConfig.MEDIUM;
                    const sta = statusConfig[r.status] || statusConfig.PENDING;
                    return (
                      <div key={r.id} style={styles.reportCard}>
                        {r.imageUrl && <img src={r.imageUrl} alt="damage" style={styles.reportImg} />}
                        <div style={{ flex: 1 }}>
                          <div style={styles.chipRow}>
                            <span style={styles.chip("#c2410c", "#fff7ed")}>{r.damageType}</span>
                            <span style={styles.chip(sev.color, sev.bg)}>{r.severity}</span>
                            <span style={styles.chip(sta.color, sta.bg)}>{r.status.replace("_", " ")}</span>
                          </div>
                          <p style={{ color: "#374151", fontSize: 14, margin: "0 0 6px" }}>
                            {r.description || "No description provided"}
                          </p>
                          <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>
                            {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)} &nbsp;&middot;&nbsp; {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
