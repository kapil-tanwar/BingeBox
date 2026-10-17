import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "";
// Normalize: if user provides https://backend.onrender.com or https://backend.onrender.com/api
const baseURL = rawBaseURL
  ? rawBaseURL.replace(/\/+$/, "").endsWith("/api")
    ? rawBaseURL.replace(/\/+$/, "")
    : `${rawBaseURL.replace(/\/+$/, "")}/api`
  : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
