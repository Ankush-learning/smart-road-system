import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ── Heatmap layer using leaflet.heat via CDN ──────────────────────────────────
function HeatmapLayer({ points }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!window.L || !window.L.heatLayer) return;
    if (layerRef.current) { layerRef.current.remove(); layerRef.current = null; }
    if (points.length === 0) return;
    layerRef.current = window.L.heatLayer(points, {
      radius: 35, blur: 25, maxZoom: 17,
      gradient: { 0.2: "#3b82f6", 0.5: "#f59e0b", 0.8: "#ef4444", 1.0: "#7f1d1d" },
    }).addTo(map);
    return () => { if (layerRef.current) layerRef.current.remove(); };
  }, [points, map]);

  return null;
}

const STATUSES = ["PENDING", "IN_PROGRESS", "RESOLVED"];

const severityConfig = {
  LOW:    { color: "#15803d", bg: "#dcfce7" },
  MEDIUM: { color: "#b45309", bg: "#fef3c7" },
  HIGH:   { color: "#b91c1c", bg: "#fee2e2" },
};
const statusConfig = {
  PENDING:     { color: "#6b7280", bg: "#f3f4f6", label: "Pending" },
  IN_PROGRESS: { color: "#1d4ed8", bg: "#dbeafe", label: "In Progress" },
  RESOLVED:    { color: "#15803d", bg: "#dcfce7", label: "Resolved" },
};

const s = {
  page:   { minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" },
  nav:    { background: "#0f172a", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 1000 },
  logo:   { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  tabs:   { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 2rem", display: "flex" },
  tab:    (a) => ({ padding: "14px 24px", border: "none", borderBottom: a ? "2px solid #c2410c" : "2px solid transparent", background: "none", cursor: "pointer", fontWeight: a ? 600 : 400, color: a ? "#c2410c" : "#64748b", fontSize: 14, fontFamily: "'Inter', sans-serif" }),
  body:   { maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" },
  grid4:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  grid2:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 },
  card:   { background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" },
  ch:     { padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" },
  ct:     { fontWeight: 600, fontSize: 14, color: "#0f172a", margin: 0 },
  cb:     { padding: 20 },
  statCard: (accent) => ({ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px 24px", borderTop: `3px solid ${accent}` }),
  statVal:  { fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 4px" },
  statLbl:  { fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 },
  chip:   (c, bg) => ({ background: bg, color: c, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.3px", display: "inline-block" }),
  table:  { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:     { padding: "10px 14px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9" },
  td:     { padding: "14px", borderBottom: "1px solid #f8fafc", color: "#374151", verticalAlign: "middle" },
  select: { padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, fontFamily: "'Inter', sans-serif", cursor: "pointer", fontWeight: 600, outline: "none" },
  bar:    { height: 8, borderRadius: 4, background: "#f1f5f9", overflow: "hidden", marginBottom: 6 },
  barFill:(pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.5s ease" }),
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [heatReady, setHeatReady] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  // Load leaflet.heat script
  useEffect(() => {
    if (window.L?.heatLayer) { setHeatReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
    script.onload = () => setHeatReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [statsRes, reportsRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/reports"),
        ]);
        setStats(statsRes.data);
        setReports(reportsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    try {
      const res = await API.patch(`/admin/reports/${reportId}/status`, { status: newStatus });
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: res.data.status } : r));
      // Refresh stats
      const statsRes = await API.get("/admin/stats");
      setStats(statsRes.data);
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Heatmap points: [lat, lng, intensity]
  const heatPoints = reports.map(r => [
    r.latitude, r.longitude,
    r.severity === "HIGH" ? 1.0 : r.severity === "MEDIUM" ? 0.6 : 0.3
  ]);

  const total = stats?.totalReports || 0;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={s.page}>
        {/* Navbar */}
        <nav style={s.nav}>
          <div style={s.logo} onClick={() => navigate("/")}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#c2410c"/>
              <path d="M7 14h14M14 7l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.3px" }}>RoadWatch</span>
            <span style={{ background: "#c2410c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>Admin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#94a3b8", fontSize: 14 }}>Welcome, {user?.fullName?.split(" ")[0]}</span>
            <button onClick={handleLogout} style={{ background: "none", border: "1px solid #334155", borderRadius: 8, padding: "6px 16px", cursor: "pointer", color: "#94a3b8", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Sign out</button>
          </div>
        </nav>

        {/* Tabs */}
        <div style={s.tabs}>
          <button style={s.tab(tab === "overview")} onClick={() => setTab("overview")}>Overview</button>
          <button style={s.tab(tab === "reports")} onClick={() => setTab("reports")}>All Reports</button>
          <button style={s.tab(tab === "heatmap")} onClick={() => setTab("heatmap")}>Heatmap</button>
        </div>

        <div style={s.body}>
          {loading ? (
            <p style={{ color: "#64748b", fontSize: 14 }}>Loading dashboard...</p>
          ) : (
            <>
              {/* ── Overview Tab ── */}
              {tab === "overview" && stats && (
                <div>
                  {/* Stat cards */}
                  <div style={s.grid4}>
                    <div style={s.statCard("#6366f1")}>
                      <p style={s.statVal}>{stats.totalReports}</p>
                      <p style={s.statLbl}>Total Reports</p>
                    </div>
                    <div style={s.statCard("#f59e0b")}>
                      <p style={s.statVal}>{stats.pendingReports}</p>
                      <p style={s.statLbl}>Pending</p>
                    </div>
                    <div style={s.statCard("#3b82f6")}>
                      <p style={s.statVal}>{stats.inProgressReports}</p>
                      <p style={s.statLbl}>In Progress</p>
                    </div>
                    <div style={s.statCard("#22c55e")}>
                      <p style={s.statVal}>{stats.resolvedReports}</p>
                      <p style={s.statLbl}>Resolved</p>
                    </div>
                  </div>

                  <div style={s.grid2}>
                    {/* By Damage Type */}
                    <div style={s.card}>
                      <div style={s.ch}><p style={s.ct}>Reports by Damage Type</p></div>
                      <div style={s.cb}>
                        {Object.entries(stats.byDamageType || {}).map(([type, count]) => (
                          <div key={type} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{type}</span>
                              <span style={{ fontSize: 13, color: "#6b7280" }}>{count} ({total ? Math.round((count / total) * 100) : 0}%)</span>
                            </div>
                            <div style={s.bar}>
                              <div style={s.barFill(total ? (count / total) * 100 : 0, "#c2410c")} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* By Severity */}
                    <div style={s.card}>
                      <div style={s.ch}><p style={s.ct}>Reports by Severity</p></div>
                      <div style={s.cb}>
                        {[["HIGH", "#ef4444"], ["MEDIUM", "#f59e0b"], ["LOW", "#22c55e"]].map(([sev, color]) => {
                          const count = stats.bySeverity?.[sev] || 0;
                          return (
                            <div key={sev} style={{ marginBottom: 16 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{sev}</span>
                                <span style={{ fontSize: 13, color: "#6b7280" }}>{count} ({total ? Math.round((count / total) * 100) : 0}%)</span>
                              </div>
                              <div style={s.bar}>
                                <div style={s.barFill(total ? (count / total) * 100 : 0, color)} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Resolution rate */}
                  <div style={{ ...s.card, padding: 24 }}>
                    <p style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", margin: "0 0 6px" }}>Resolution Rate</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: "#15803d", margin: "0 0 4px", letterSpacing: "-1px" }}>
                      {total ? Math.round((stats.resolvedReports / total) * 100) : 0}%
                    </p>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{stats.resolvedReports} of {total} reports resolved</p>
                  </div>
                </div>
              )}

              {/* ── Reports Tab ── */}
              {tab === "reports" && (
                <div style={s.card}>
                  <div style={s.ch}>
                    <p style={s.ct}>All Reports ({reports.length})</p>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={s.table}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={s.th}>ID</th>
                          <th style={s.th}>Citizen</th>
                          <th style={s.th}>Type</th>
                          <th style={s.th}>Severity</th>
                          <th style={s.th}>Location</th>
                          <th style={s.th}>Date</th>
                          <th style={s.th}>Status</th>
                          <th style={s.th}>Photo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map(r => {
                          const sev = severityConfig[r.severity] || severityConfig.MEDIUM;
                          const sta = statusConfig[r.status] || statusConfig.PENDING;
                          return (
                            <tr key={r.id} style={{ background: updatingId === r.id ? "#f8fafc" : "#fff" }}>
                              <td style={s.td}>
                                <span style={{ fontWeight: 600, color: "#6b7280" }}>#{r.id}</span>
                              </td>
                              <td style={s.td}>
                                <span style={{ fontWeight: 600, color: "#0f172a" }}>{r.fullName}</span>
                              </td>
                              <td style={s.td}>
                                <span style={s.chip("#c2410c", "#fff7ed")}>{r.damageType}</span>
                              </td>
                              <td style={s.td}>
                                <span style={s.chip(sev.color, sev.bg)}>{r.severity}</span>
                              </td>
                              <td style={s.td}>
                                <span style={{ color: "#64748b", fontFamily: "monospace", fontSize: 12 }}>
                                  {r.latitude?.toFixed(3)}, {r.longitude?.toFixed(3)}
                                </span>
                              </td>
                              <td style={s.td}>
                                {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td style={s.td}>
                                <select
                                  value={r.status}
                                  disabled={updatingId === r.id}
                                  onChange={e => handleStatusChange(r.id, e.target.value)}
                                  style={{ ...s.select, color: sta.color, background: sta.bg, borderColor: sta.bg }}
                                >
                                  {STATUSES.map(st => (
                                    <option key={st} value={st}>{statusConfig[st]?.label || st}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={s.td}>
                                {r.imageUrl ? (
                                  <a href={r.imageUrl} target="_blank" rel="noreferrer"
                                    style={{ color: "#c2410c", fontWeight: 600, fontSize: 12, textDecoration: "none" }}>
                                    View
                                  </a>
                                ) : (
                                  <span style={{ color: "#cbd5e1", fontSize: 12 }}>None</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {reports.length === 0 && (
                          <tr>
                            <td colSpan={8} style={{ ...s.td, textAlign: "center", color: "#94a3b8", padding: "3rem" }}>
                              No reports submitted yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Heatmap Tab ── */}
              {tab === "heatmap" && (
                <div>
                  <div style={{ ...s.card, marginBottom: 16 }}>
                    <div style={s.ch}>
                      <p style={s.ct}>Damage Heatmap</p>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          {reports.length} report{reports.length !== 1 ? "s" : ""} plotted
                        </span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {[["Low", "#3b82f6"], ["Medium", "#f59e0b"], ["High", "#ef4444"]].map(([label, color]) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                              <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: 520, width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {heatReady && <HeatmapLayer points={heatPoints} />}
                      </MapContainer>
                    </div>
                  </div>
                  {!heatReady && (
                    <p style={{ color: "#64748b", fontSize: 13, textAlign: "center" }}>Loading heatmap layer...</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
