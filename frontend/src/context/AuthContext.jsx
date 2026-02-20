import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem("token");
    const role     = localStorage.getItem("role");
    const email    = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    const userId   = localStorage.getItem("userId");
    if (token && role) setUser({ token, role, email, fullName, userId });
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const data = res.data;
    localStorage.setItem("token",    data.token);
    localStorage.setItem("role",     data.role);
    localStorage.setItem("email",    data.email);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("userId",   String(data.userId));
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const res = await API.post("/auth/register", { fullName, email, password });
    const data = res.data;
    localStorage.setItem("token",    data.token);
    localStorage.setItem("role",     data.role);
    localStorage.setItem("email",    data.email);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("userId",   String(data.userId));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
