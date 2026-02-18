import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://smart-road-system-awlb.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor — attach JWT ─────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle 401 globally ───────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
