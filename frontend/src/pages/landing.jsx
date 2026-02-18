import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <span>🛣️</span> RoadWatch
        </div>
        <div className="landing-nav-links">
          <button className="btn-outline" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-content">
          <span className="hero-tag">Civic Tech Platform</span>
          <h1 className="hero-title">
            Report Road Damage.<br />
            <span className="hero-highlight">Get It Fixed Faster.</span>
          </h1>
          <p className="hero-subtitle">
            A smart platform connecting citizens and authorities to identify,
            track, and resolve road damage in real time.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary hero-btn" onClick={() => navigate("/signup")}>
              🏙️ Citizen Portal
            </button>
            <button className="btn-outline hero-btn" onClick={() => navigate("/login")}>
              🛠️ Admin Dashboard
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">
              <span className="hero-card-dot red" />
              <span className="hero-card-dot yellow" />
              <span className="hero-card-dot green" />
            </div>
            <div className="hero-card-body">
              <div className="hero-stat">
                <span className="hero-stat-number">2,400+</span>
                <span className="hero-stat-label">Reports Submitted</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">87%</span>
                <span className="hero-stat-label">Resolution Rate</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">48hr</span>
                <span className="hero-stat-label">Avg Response Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="landing-features">
        <h2 className="features-title">Everything you need in one platform</h2>
        <p className="features-subtitle">
          From reporting to resolution — powered by real-time data.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Live Damage Reporting</h3>
            <p>
              Citizens submit damage reports with photos, GPS location, and
              severity ratings instantly from any device.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔥</div>
            <h3>Heatmap Visualization</h3>
            <p>
              Admins see damage density across the city on an interactive
              heatmap to prioritize repair zones.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚧</div>
            <h3>Optimized Routing</h3>
            <p>
              Smart routing engine clusters nearby reports and generates
              efficient maintenance crew routes automatically.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Before & After Verification</h3>
            <p>
              Visual proof of repair completion with before and after photo
              comparison keeps citizens informed and builds trust.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2024 RoadWatch — Built for smarter cities.</p>
      </footer>

    </div>
  );
}

export default Landing;
