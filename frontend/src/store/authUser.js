import api from "../utils/api";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  //check if the user is signing up or not
  isSigningUp: false,
  //check is the user is authenticated or not
  isCheckingAuth: true,
  isLoggingIn: false,
  isLoggingOut: false,
  signup: async (userInfo) => {
    set({ isSigningUp: true });
    try {
      const response = await api.post("/auth/signup", userInfo);
      if (response.data?.token) {
        localStorage.setItem("bingebox-token", response.data.token);
      }
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Account created successfully");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? "Backend API not found. Please verify VITE_API_URL."
          : error.message || "Something went wrong");
      toast.error(msg);
      set({ isSigningUp: false, user: null });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await api.post("/auth/signin", credentials);
      if (response.data?.token) {
        localStorage.setItem("bingebox-token", response.data.token);
      }
      set({ user: response.data.user, isLoggingIn: false });
      toast.success("Signed in successfully");
    } catch (error) {
      console.log("Login error:", error);
      set({ isLoggingIn: false, user: null });
      const msg =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? "Cannot connect to backend API (404 Not Found). Check backend URL."
          : error.message || "Login failed");
      toast.error(msg);
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("bingebox-token");
      set({ user: null, isLoggingOut: false });
      toast.success("Logout successful");
    } catch (error) {
      localStorage.removeItem("bingebox-token");
      set({ isLoggingOut: false, user: null });
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await api.get("/auth/authCheck");
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("bingebox-token");
      }
      set({ user: null, isCheckingAuth: false });
      // Only log unexpected errors, not standard unauthenticated responses
      if (error.response?.status !== 401 && error.response?.status !== 404) {
        console.error("Auth check failed:", error);
      }
    }
  },
}));
