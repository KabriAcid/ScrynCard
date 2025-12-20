import { create } from "zustand";
import { User, UserRole } from "@/lib/mockTypes";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock login - determine role based on email
      let role: UserRole = "citizen";
      if (email.includes("admin")) role = "admin";
      if (email.includes("politician")) role = "politician";

      const mockUser: User = {
        id: `USER-${Math.random().toString(36).substr(2, 9)}`,
        fullName: email.split("@")[0],
        email,
        phone: "+2348012345678",
        role,
        verified: true,
        createdAt: new Date().toISOString(),
      };

      set({
        user: mockUser,
        token: "mock-jwt-token-" + Math.random().toString(36).substr(2),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  register: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: `USER-${Math.random().toString(36).substr(2, 9)}`,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role || "citizen",
        verified: false,
        createdAt: new Date().toISOString(),
      };
      set({
        user: mockUser,
        token: "mock-jwt-token-" + Math.random().toString(36).substr(2),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null });
  },

  setUser: (user) => {
    set({ user });
  },
}));
