import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — wraps any route that requires authentication.
 *
 * Usage:
 *   <ProtectedRoute user={user} allowedRoles={["ADMIN"]}>
 *     <AdminDashboard />
 *   </ProtectedRoute>
 */
function ProtectedRoute({ user, loading, allowedRoles, children }) {
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the right dashboard if wrong role
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/citizen"} replace />;
  }

  return children;
}

export default ProtectedRoute;
