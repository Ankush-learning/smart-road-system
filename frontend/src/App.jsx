import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing          from "./pages/landing";
import Login            from "./pages/login";
import Signup           from "./pages/signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard   from "./pages/AdminDashboard";

function App() {
  const { user, loading } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "ADMIN" ? "/admin" : "/citizen"} replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to={user.role === "ADMIN" ? "/admin" : "/citizen"} replace />
            ) : (
              <Signup />
            )
          }
        />

        {/* Protected — Citizen */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute user={user} loading={loading} allowedRoles={["CITIZEN", "ADMIN"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected — Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} loading={loading} allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
