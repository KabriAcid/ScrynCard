import { create } from "zustand";
import {
  AdminStats,
  Order,
  Politician,
  Redemption,
  FraudCheck,
} from "@/lib/mockTypes";
import { adminService } from "@/services/mockService";

interface AdminState {
  stats: AdminStats | null;
  politicians: Politician[];
  orders: Order[];
  redemptions: Redemption[];
  fraudAlerts: FraudCheck[];
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchPoliticians: (page?: number) => Promise<void>;
  fetchOrders: (page?: number) => Promise<void>;
  fetchRedemptions: (page?: number) => Promise<void>;
  fetchFraudAlerts: (page?: number) => Promise<void>;
  reviewFraud: (
    fraudId: string,
    decision: "approved" | "rejected"
  ) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  politicians: [],
  orders: [],
  redemptions: [],
  fraudAlerts: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getStats();
      if (response.success && response.data) {
        set({ stats: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPoliticians: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getAllPoliticians(page);
      if (response.success) {
        set({ politicians: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrders: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getAllOrders(page);
      if (response.success) {
        set({ orders: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchRedemptions: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getAllRedemptions(page);
      if (response.success) {
        set({ redemptions: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchFraudAlerts: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getFraudAlerts(page);
      if (response.success) {
        set({ fraudAlerts: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  reviewFraud: async (fraudId: string, decision: "approved" | "rejected") => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.reviewFraudCase(fraudId, decision);
      if (response.success) {
        // Update the fraud alert in the list
        set((state) => ({
          fraudAlerts: state.fraudAlerts.map((alert) =>
            alert.id === fraudId
              ? { ...alert, decision, reviewedAt: new Date().toISOString() }
              : alert
          ),
          isLoading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
