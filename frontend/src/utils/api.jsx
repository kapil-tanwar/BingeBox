import axios from "axios";

// Base URL comes from Vite env; falls back to "/api" to work with dev proxy
const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default api;


