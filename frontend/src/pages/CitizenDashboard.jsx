import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
  }, [position, map]);
  return null;
}

// ── Image validation via backend ──────────────────────────────────────────────
async function validateImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        const res = await API.post("/citizen/reports/validate-image", { base64, mimeType: file.type });
        resolve(res.data); // { valid: true/false, message: "..." }
      } catch {
        resolve({ valid: true, message: "" }); // fail open
      }
    };
    reader.readAsDataURL(file);
  });
}

const severityConfig = { LOW: { color: "#15803d", bg: "#dcfce7" }, MEDIUM: { color: "#b45309", bg: "#fef3c7" }, HIGH: { color: "#b91c1c", bg: "#fee2e2" } };
const statusConfig   = { PENDING: { color: "#6b7280", bg: "#f3f4f6" }, IN_PROGRESS: { color: "#1d4ed8", bg: "#dbeafe" }, RESOLVED: { color: "#15803d", bg: "#dcfce7" } };

const s = {
  page:    { minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" },
  nav:     { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 1000 },
  logo:    { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  tabs:    { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 2rem", display: "flex" },
  tab:     (a) => ({ padding: "14px 24px", border: "none", borderBottom: a ? "2px solid #c2410c" : "2px solid transparent", background: "none", cursor: "pointer", fontWeight: a ? 600 : 400, color: a ? "#c2410c" : "#64748b", fontSize: 14, fontFamily: "'Inter', sans-serif" }),
  body:    { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
  header:  { marginBottom: 24 },
  title:   { fontWeight: 700, fontSize: 22, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.3px" },
  sub:     { color: "#64748b", fontSize: 14, margin: 0 },
  split:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" },
  card:    { background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" },
  ch:      { padding: "14px 20px", borderBottom: "1px solid #f1f5f9" },
  ct:      { fontWeight: 600, fontSize: 14, color: "#0f172a", margin: 0 },
  cb:      { padding: 20 },
  label:   { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 },
  input:   { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#0f172a", outline: "none", boxSizing: "border-box" },
  select:  { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#0f172a", background: "#fff", cursor: "pointer", outline: "none" },
  textarea:{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, fontFamily: "'Inter', sans-serif", resize: "vertical", color: "#0f172a", outline: "none", boxSizing: "border-box" },
  locBtn:  (loading) => ({ width: "100%", marginTop: 12, padding: "9px 0", border: "1px solid #c2410c", borderRadius: 8, background: loading ? "#fff7ed" : "#fff", color: "#c2410c", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }),
  hint:    (ok) => ({ padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, marginTop: 10, background: ok ? "#f0fdf4" : "#fffbeb", color: ok ? "#15803d" : "#b45309", border: `1px solid ${ok ? "#bbf7d0" : "#fde68a"}` }),
  submitBtn:(d) => ({ width: "100%", background: d ? "#e2e8f0" : "#c2410c", color: d ? "#94a3b8" : "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 15, cursor: d ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", marginTop: 8 }),
  success: { background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#15803d", fontWeight: 600, fontSize: 14 },
  imgErr:  { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginTop: 10, color: "#b91c1c", fontSize: 13, fontWeight: 500 },
  imgOk:   { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", marginTop: 10, color: "#15803d", fontSize: 13, fontWeight: 500 },
  chip:    (c, bg) => ({ background: bg, color: c, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.3px" }),
  rCard:   { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0", display: "flex", gap: 16 },
  rImg:    { width: 90, height: 72, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  empty:   { textAlign: "center", padding: "4rem 2rem", color: "#94a3b8" },
};

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]           = useState("report");
  const [position, setPosition] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError]   = useState("");
  const [form, setForm]         = useState({ damageType: "POTHOLE", severity: "MEDIUM", description: "" });
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [imgStatus, setImgStatus] = useState(null); // null | "checking" | "valid" | "invalid"
  const [imgMessage, setImgMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [myReports, setMyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  // ── Geolocation ─────────────────────────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) { setGeoError("Geolocation is not supported by your browser."); return; }
    setGeoLoading(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(err.code === 1 ? "Location permission denied. Please allow access and try again." : "Unable to detect location. Try clicking on the map.");
        setGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── Image change + validation ────────────────────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic checks
    if (!file.type.startsWith("image/")) {
      setImgStatus("invalid");
      setImgMessage("File must be an image (JPG, PNG, etc.).");
      setImage(null); setPreview(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImgStatus("invalid");
      setImgMessage("Image must be under 10 MB.");
      setImage(null); setPreview(null);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setImgStatus("checking");
    setImgMessage("");

    const result = await validateImage(file);
    setImgStatus(result.valid ? "valid" : "invalid");
    setImgMessage(result.message);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) { alert("Please select a location on the map or use Detect My Location."); return; }
    if (imgStatus === "invalid") { alert("Please remove the invalid image before submitting."); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify({ ...form, latitude: position.lat, longitude: position.lng })], { type: "application/json" }));
      if (image && imgStatus !== "invalid") fd.append("image", image);
      await API.post("/citizen/reports", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setPosition(null);
      setForm({ damageType: "POTHOLE", severity: "MEDIUM", description: "" });
      setImage(null); setPreview(null); setImgStatus(null); setImgMessage("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadMyReports = async () => {
    setLoadingReports(true);
    try { const res = await API.get("/citizen/reports/my"); setMyReports(res.data); }
    catch (err) { console.error(err); }
    finally { setLoadingReports(false); }
  };

  useEffect(() => { if (tab === "myreports") loadMyReports(); }, [tab]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={s.page}>
        {/* Navbar */}
        <nav style={s.nav}>
          <div style={s.logo} onClick={() => navigate("/")}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#c2410c"/>
              <path d="M7 14h14M14 7l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", letterSpacing: "-0.3px" }}>RoadWatch</span>
            <span style={{ background: "#fff7ed", color: "#c2410c", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>Citizen</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#64748b", fontSize: 14 }}>Welcome, {user?.fullName?.split(" ")[0]}</span>
            <button onClick={handleLogout} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 16px", cursor: "pointer", color: "#64748b", fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Sign out</button>
          </div>
        </nav>

        {/* Tabs */}
        <div style={s.tabs}>
          <button style={s.tab(tab === "report")} onClick={() => setTab("report")}>Report Damage</button>
          <button style={s.tab(tab === "myreports")} onClick={() => setTab("myreports")}>My Reports</button>
        </div>

        <div style={s.body}>
          {/* ── Report Tab ── */}
          {tab === "report" && (
            <div>
              <div style={s.header}>
                <h2 style={s.title}>Report Road Damage</h2>
                <p style={s.sub}>Click on the map to pin the location, or use the detect button. Then fill in the details.</p>
              </div>
              {success && <div style={s.success}>Report submitted successfully.</div>}
              <div style={s.split}>
                {/* Map */}
                <div style={s.card}>
                  <div style={s.ch}><p style={s.ct}>Select Location</p></div>
                  <div style={s.cb}>
                    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: 320, width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker onSelect={setPosition} />
                        {position && <Marker position={position} />}
                        {position && <FlyTo position={position} />}
                      </MapContainer>
                    </div>

                    {/* Detect My Location button */}
                    <button onClick={detectLocation} disabled={geoLoading} style={s.locBtn(geoLoading)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                        <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" opacity="0"/>
                      </svg>
                      {geoLoading ? "Detecting location..." : "Detect My Location"}
                    </button>

                    {geoError && (
                      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginTop: 8, color: "#b91c1c", fontSize: 12, fontWeight: 500 }}>{geoError}</div>
                    )}

                    <p style={s.hint(!!position)}>
                      {position ? `Location selected: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : "No location selected — click on the map or detect your location"}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div style={s.card}>
                  <div style={s.ch}><p style={s.ct}>Damage Details</p></div>
                  <div style={s.cb}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <label style={s.label}>Damage Type</label>
                        <select style={s.select} value={form.damageType} onChange={e => setForm(p => ({ ...p, damageType: e.target.value }))}>
                          <option value="POTHOLE">Pothole</option>
                          <option value="CRACK">Road Crack</option>
                          <option value="WATERLOGGING">Waterlogging</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={s.label}>Severity</label>
                        <select style={s.select} value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                      <div>
                        <label style={s.label}>Description</label>
                        <textarea style={s.textarea} rows={3} placeholder="Describe the damage in detail..."
                          value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                      </div>
                      <div>
                        <label style={s.label}>Photo (optional)</label>
                        <input type="file" accept="image/*" style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#374151" }} onChange={handleImageChange} />
                        {imgStatus === "checking" && (
                          <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Validating image...</div>
                        )}
                        {imgStatus === "invalid" && (
                          <div style={s.imgErr}>{imgMessage || "This image does not appear to show road damage. Please upload a relevant photo."}</div>
                        )}
                        {imgStatus === "valid" && (
                          <div style={s.imgOk}>{imgMessage || "Image verified as road damage."}</div>
                        )}
                        {preview && imgStatus !== "invalid" && (
                          <img src={preview} alt="preview" style={{ marginTop: 10, height: 100, borderRadius: 8, objectFit: "cover", width: "100%" }} />
                        )}
                      </div>
                      <button type="submit" disabled={submitting || !position || imgStatus === "checking" || imgStatus === "invalid"} style={s.submitBtn(submitting || !position || imgStatus === "checking" || imgStatus === "invalid")}>
                        {submitting ? "Submitting..." : "Submit Report"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── My Reports Tab ── */}
          {tab === "myreports" && (
            <div>
              <div style={s.header}>
                <h2 style={s.title}>My Reports</h2>
                <p style={s.sub}>All damage reports you have submitted.</p>
              </div>
              {loadingReports ? (
                <p style={{ color: "#64748b", fontSize: 14 }}>Loading reports...</p>
              ) : myReports.length === 0 ? (
                <div style={s.empty}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                    <path d="M9 12h6M9 16h6M7 4H4a1 1 0 00-1 1v15a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1h-3M9 4a1 1 0 011-1h4a1 1 0 011 1v0a1 1 0 01-1 1H10a1 1 0 01-1-1v0z"/>
                  </svg>
                  <p style={{ fontWeight: 600, color: "#475569", marginBottom: 4, fontSize: 15 }}>No reports yet</p>
                  <p style={{ fontSize: 13 }}>Switch to the Report Damage tab to submit your first report.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myReports.map(r => {
                    const sev = severityConfig[r.severity] || severityConfig.MEDIUM;
                    const sta = statusConfig[r.status] || statusConfig.PENDING;
                    return (
                      <div key={r.id} style={s.rCard}>
                        {r.imageUrl && <img src={r.imageUrl} alt="damage" style={s.rImg} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={s.chip("#c2410c", "#fff7ed")}>{r.damageType}</span>
                            <span style={s.chip(sev.color, sev.bg)}>{r.severity}</span>
                            <span style={s.chip(sta.color, sta.bg)}>{r.status.replace("_", " ")}</span>
                          </div>
                          <p style={{ color: "#374151", fontSize: 14, margin: "0 0 6px" }}>{r.description || "No description provided"}</p>
                          <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>
                            {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)} &nbsp;&middot;&nbsp;
                            {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
