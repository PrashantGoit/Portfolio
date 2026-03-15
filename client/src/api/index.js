import axios from "axios";

// In dev, Vite proxies /api → http://localhost:5000
// In production, set VITE_API_URL to your Render backend URL
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach admin token to requests when available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Contact API ────────────────────────────────────────────────────────────
export const contactAPI = {
  submit: (data) => api.post("/contact", data),
  getAll: (page = 1) => api.get(`/contact?page=${page}`),
  getById: (id) => api.get(`/contact/${id}`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export default api;
