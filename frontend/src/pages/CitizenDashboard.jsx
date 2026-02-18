import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      {/* Top Nav */}
      <header className="dashboard-nav">
        <div className="dashboard-nav-brand">
          <span>🛣️</span> RoadWatch
        </div>
        <div className="dashboard-nav-user">
          <span className="dashboard-badge citizen">Citizen</span>
          <span className="dashboard-username">{user?.fullName}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Welcome, {user?.fullName?.split(" ")[0]} 👋</h2>
          <p>Report road damage and track your submissions.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dash-card coming-soon">
            <div className="dash-card-icon">📍</div>
            <h3>Report Damage</h3>
            <p>Submit a new road damage report with photo and GPS location.</p>
            <span className="coming-soon-tag">Coming next</span>
          </div>

          <div className="dash-card coming-soon">
            <div className="dash-card-icon">📋</div>
            <h3>My Reports</h3>
            <p>View and track status of your submitted reports.</p>
            <span className="coming-soon-tag">Coming next</span>
          </div>

          <div className="dash-card coming-soon">
            <div className="dash-card-icon">🗺️</div>
            <h3>Damage Map</h3>
            <p>See all reported road damage in your area on an interactive map.</p>
            <span className="coming-soon-tag">Coming next</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CitizenDashboard;
