import { useState, useEffect, useCallback } from "react";
import API from "../api";

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token    = localStorage.getItem("token");
    const role     = localStorage.getItem("role");
    const email    = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    const userId   = localStorage.getItem("userId");

    if (token && role) {
      setUser({ token, role, email, fullName, userId });
    }

    setLoading(false);
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const data = res.data;

    localStorage.setItem("token",    data.token);
    localStorage.setItem("role",     data.role);
    localStorage.setItem("email",    data.email);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("userId",   data.userId);

    setUser(data);
    return data;
  }, []);

  // ─── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(async (fullName, email, password) => {
    const res = await API.post("/auth/register", { fullName, email, password });
    const data = res.data;

    localStorage.setItem("token",    data.token);
    localStorage.setItem("role",     data.role);
    localStorage.setItem("email",    data.email);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("userId",   data.userId);

    setUser(data);
    return data;
  }, []);

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  return { user, loading, login, register, logout };
}
