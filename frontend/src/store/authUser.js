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
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({ isSigningUp: false, user: null });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await api.post("/auth/signin", credentials);
      set({ user: response.data.user, isLoggingIn: false });
    } catch (error) {
      console.log("Login error:", error);
      set({ isLoggingIn: false, user: null });
      toast.error(error.response.data.message || "Login failed");
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await api.post("/auth/logout");
      set({ user: null, isLoggingOut: false });
      toast.success("Logout successful");
    } catch (error) {
      set({ isLoggingOut: false });
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await api.get("/auth/authCheck");
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      console.log(error);
    }
  },
}));
