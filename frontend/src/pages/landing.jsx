import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="gov-landing">
      {/* ─── Top Info Bar ──────────────────────────────────────────────── */}
      <div className="gov-topbar">
        <div className="gov-topbar-inner">
          <div className="gov-topbar-left">
            <a href="#main-content" className="gov-skip-link">Skip to Main Content</a>
            <span className="gov-topbar-separator">|</span>
            <span>Screen Reader Access</span>
          </div>
          <div className="gov-topbar-right">
            <span>📞 Helpline: 1800-XXX-XXXX</span>
            <span className="gov-topbar-separator">|</span>
            <span>✉ complaints@smartmc.gov.in</span>
          </div>
        </div>
      </div>

      {/* ─── Main Header ──────────────────────────────────────────────── */}
      <header className="gov-header">
        <div className="gov-header-inner">
          <div className="gov-header-brand">
            <div className="gov-emblem">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="25" stroke="#003366" strokeWidth="2" fill="#fff" />
                <circle cx="26" cy="26" r="18" stroke="#003366" strokeWidth="1.5" fill="none" />
                <circle cx="26" cy="26" r="5" fill="#003366" />
                <line x1="26" y1="8" x2="26" y2="18" stroke="#003366" strokeWidth="1.5" />
                <line x1="26" y1="34" x2="26" y2="44" stroke="#003366" strokeWidth="1.5" />
                <line x1="8" y1="26" x2="18" y2="26" stroke="#003366" strokeWidth="1.5" />
                <line x1="34" y1="26" x2="44" y2="26" stroke="#003366" strokeWidth="1.5" />
                <path d="M20 14l6 4 6-4" stroke="#FF9933" strokeWidth="1.5" fill="none" />
                <path d="M20 38l6-4 6 4" stroke="#138808" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div className="gov-header-titles">
              <h1 className="gov-title-en">Smart Municipal Corporation</h1>
              <p className="gov-subtitle-en">Road Infrastructure Management System</p>
            </div>
          </div>
          <div className="gov-header-actions">
            <button onClick={() => navigate("/login")} className="gov-btn gov-btn-outline-light">
              Employee Login
            </button>
            <button onClick={() => navigate("/signup")} className="gov-btn gov-btn-primary">
              Citizen Registration
            </button>
          </div>
        </div>
        <div className="gov-tricolor-band">
          <div className="gov-tricolor-saffron"></div>
          <div className="gov-tricolor-white"></div>
          <div className="gov-tricolor-green"></div>
        </div>
      </header>

      {/* ─── Navigation Bar ───────────────────────────────────────────── */}
      <nav className="gov-nav">
        <div className="gov-nav-inner">
          <a href="#main-content">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#statistics">Statistics</a>
          <a href="#contact">Contact Us</a>
        </div>
      </nav>

      {/* ─── Announcement Ticker ──────────────────────────────────────── */}
      <div className="gov-ticker">
        <span className="gov-ticker-label">📢 NOTICE</span>
        <div className="gov-ticker-track">
          <div className="gov-ticker-content">
            <span>All citizens are requested to report road damages through this portal for faster resolution.</span>
            <span className="gov-ticker-separator">★</span>
            <span>Helpline operational 24x7 — Call 1800-XXX-XXXX for assistance.</span>
            <span className="gov-ticker-separator">★</span>
            <span>Newly registered users can track all complaints in real-time via the Citizen Dashboard.</span>
            <span className="gov-ticker-separator">★</span>
          </div>
        </div>
      </div>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section id="main-content" className="gov-hero">
        <div className="gov-hero-inner">
          <div className="gov-hero-content">
            <div className="gov-hero-badge">Government of India Initiative</div>
            <h2 className="gov-hero-title">
              Smart Road Damage<br />
              <span className="gov-hero-highlight">Reporting & Resolution System</span>
            </h2>
            <p className="gov-hero-desc">
              An integrated platform enabling citizens to report road infrastructure damage directly to municipal authorities.
              Reports are geo-tagged, AI-verified, and tracked from submission to resolution.
            </p>
            <div className="gov-hero-btns">
              <button onClick={() => navigate("/signup")} className="gov-btn gov-btn-saffron gov-btn-lg">
                🏛 Citizen Portal
              </button>
              <button onClick={() => navigate("/login")} className="gov-btn gov-btn-navy gov-btn-lg">
                🔐 Admin Dashboard
              </button>
            </div>
          </div>
          <div className="gov-hero-visual">
            <div className="gov-stats-card">
              <div className="gov-stats-header">
                <span>📊 Platform Performance</span>
              </div>
              <div className="gov-stats-body">
                {[
                  { label: "Reports Submitted", value: "2,400+", icon: "📋" },
                  { label: "Resolution Rate", value: "87%", icon: "✅" },
                  { label: "Avg. Response Time", value: "48 hrs", icon: "⏱" },
                ].map((s, i) => (
                  <div key={i} className="gov-stat-row">
                    <span className="gov-stat-icon">{s.icon}</span>
                    <div>
                      <p className="gov-stat-value">{s.value}</p>
                      <p className="gov-stat-label">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services ─────────────────────────────────────────────────── */}
      <section id="services" className="gov-services">
        <div className="gov-section-inner">
          <h2 className="gov-section-title">Our Services</h2>
          <p className="gov-section-subtitle">Access civic services online through this unified platform</p>
          <div className="gov-services-grid">
            {[
              { icon: "🚧", title: "Report Road Damage", desc: "Pin the location on the map, describe the damage, and upload a photo for quick action.", action: () => navigate("/signup") },
              { icon: "📍", title: "Track Your Complaint", desc: "Monitor the real-time status of your submitted complaint — from Pending to Resolved.", action: () => navigate("/login") },
              { icon: "🗺", title: "View Damage Heatmap", desc: "Administrators can visualise reported damage density across the city on an interactive heatmap.", action: () => navigate("/login") },
              { icon: "📞", title: "Contact / Helpline", desc: "Reach out to the municipal helpdesk for queries, grievance escalation, or technical support.", action: null },
            ].map((s, i) => (
              <div key={i} className="gov-service-card" onClick={s.action} style={s.action ? { cursor: "pointer" } : {}}>
                <div className="gov-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {s.action && <span className="gov-service-link">Access Service →</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="gov-process">
        <div className="gov-section-inner">
          <h2 className="gov-section-title">How It Works</h2>
          <p className="gov-section-subtitle">Three simple steps for citizens to report and track road damage</p>
          <div className="gov-process-grid">
            {[
              { step: "STEP 1", title: "Pin the Location", desc: "Use the interactive map to mark the exact location of road damage in your area.", icon: "📌" },
              { step: "STEP 2", title: "Describe & Upload", desc: "Provide damage details — type, severity — and attach a photo. AI validates the image.", icon: "📤" },
              { step: "STEP 3", title: "Track Resolution", desc: "Monitor your complaint status in real-time as authorities take corrective action.", icon: "📈" },
            ].map((f, i) => (
              <div key={i} className="gov-process-card">
                <div className="gov-process-step">{f.step}</div>
                <div className="gov-process-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Statistics ───────────────────────────────────────────────── */}
      <section id="statistics" className="gov-statistics">
        <div className="gov-section-inner">
          <h2 className="gov-section-title gov-section-title-light">Platform Statistics</h2>
          <div className="gov-stats-grid">
            {[
              { value: "2,400+", label: "Total Reports Filed", icon: "📋" },
              { value: "87%", label: "Grievances Resolved", icon: "✅" },
              { value: "24 hrs", label: "Avg. Response Time", icon: "⏱" },
              { value: "5+", label: "Wards Covered", icon: "🏘" },
            ].map((s, i) => (
              <div key={i} className="gov-stat-card">
                <span className="gov-stat-card-icon">{s.icon}</span>
                <p className="gov-stat-card-value">{s.value}</p>
                <p className="gov-stat-card-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer id="contact" className="gov-footer">
        <div className="gov-footer-inner">
          <div className="gov-footer-col">
            <h4>Smart Municipal Corporation</h4>
            <p>Road Infrastructure Management System</p>
            <p>Municipal Bhawan, Main Road</p>
            <p>City — 000000</p>
          </div>
          <div className="gov-footer-col">
            <h4>Important Links</h4>
            <a href="#services">Our Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#statistics">Statistics</a>
            <button onClick={() => navigate("/login")} className="gov-footer-link-btn">Employee Login</button>
          </div>
          <div className="gov-footer-col">
            <h4>Contact Us</h4>
            <p>📞 Helpline: 1800-XXX-XXXX</p>
            <p>✉ complaints@smartmc.gov.in</p>
            <p>🌐 www.smartmc.gov.in</p>
          </div>
        </div>
        <div className="gov-footer-bottom">
          <p>© {new Date().getFullYear()} Smart Municipal Corporation. All Rights Reserved.</p>
          <p>Designed & Developed by SMC IT Cell | Content owned by Smart Municipal Corporation</p>
        </div>
      </footer>
    </div>
  );
}
