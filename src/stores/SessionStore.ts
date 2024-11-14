import { create } from "zustand";
import axios from "@/lib/axios";
import { LoginResponse, User } from "@/types";

export interface SessionState {
  user: User | null;
  loginLoading: boolean;
  signupLoading: boolean;
  error: string | null;
  verifyingToken: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  verifyToken: () => Promise<void>;
}

export const useAuthStore = create<SessionState>((set) => ({
  user: null,
  loginLoading: false,
  signupLoading: false,
  error: null,
  verifyingToken: true,
  login: async (email, password) => {
    set({ loginLoading: true, error: null });
    try {
      const response = await axios.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const { access_token, user } = response.data;
      sessionStorage.setItem("access_token", access_token);
      set({ user });
    } catch (error) {
      set({ error: "Login failed. Please try again." });
      console.error("Login failed", error);
    } finally {
      set({ loginLoading: false });
    }
  },
  signup: async (email, password) => {
    set({ signupLoading: true, error: null });
    try {
      // Simulate API call
      console.log("signup", email, password);
      // const user = await fakeApiSignup(email, password);
      // set({ user });
    } catch (error) {
      set({ error: "Signup failed. Please try again." });
      console.error("Signup failed", error);
    } finally {
      set({ signupLoading: false });
    }
  },
  logout: () => {
    sessionStorage.removeItem("access_token");
    set({ user: null, error: null });
  },
  clearError: () => set({ error: null }),
  verifyToken: async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      set({ user: null, verifyingToken: false });
      return;
    }
    // set({ verifyingToken: true });
    try {
      const response = await axios.get<User>("/auth/me");
      set({ user: response.data });
    } catch (error) {
      sessionStorage.removeItem("access_token");
      set({ user: null, error: "Session expired. Please log in again." });
      console.error("Token verification failed", error);
    } finally {
      set({ verifyingToken: false });
    }
  },
}));

// const fakeApiSignup = (email: string, password: string): Promise<User> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ id: "2", email });
//     }, 1000);
//   });
// };
