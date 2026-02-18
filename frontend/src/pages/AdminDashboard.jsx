import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      {/* Top Nav */}
      <header className="dashboard-nav admin-nav">
        <div className="dashboard-nav-brand">
          <span>🛣️</span> RoadWatch Admin
        </div>
        <div className="dashboard-nav-user">
          <span className="dashboard-badge admin">Admin</span>
          <span className="dashboard-username">{user?.fullName}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Admin Control Panel</h2>
          <p>Manage reports, track damage heatmaps, and optimize routing.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dash-card coming-soon">
            <div className="dash-card-icon">📊</div>
            <h3>All Reports</h3>
            <p>View, filter, and manage all citizen damage reports.</p>
            <span className="coming-soon-tag">Coming next</span>
          </div>

          <div className="dash-card coming-soon">
            <div className="dash-card-icon">🔥</div>
            <h3>Damage Heatmap</h3>
            <p>Visualize report density and identify high-priority zones.</p>
            <span className="coming-soon-tag">Coming next</span>
          </div>

          <div className="dash-card coming-soon">
            <div className="dash-card-icon">🚧</div>
            <h3>Routing Engine</h3>
            <p>Optimize maintenance crew routing based on damage clusters.</p>
            <span className="coming-soon-tag">Coming next</span>
          </div>

          <div className="dash-card coming-soon">
            <div className="dash-card-icon">✅</div>
            <h3>Status Updates</h3>
            <p>Mark reports as in-progress, resolved, or rejected.</p>
            <span className="coming-soon-tag">Coming next</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
