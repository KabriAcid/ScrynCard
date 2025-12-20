import { create } from "zustand";
import { Order } from "@/lib/mockTypes";
import { politicianService } from "@/services/mockService";

interface PoliticianState {
  politicianId: string | null;
  stats: any | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchDashboard: (politicianId: string) => Promise<void>;
  fetchOrders: (politicianId: string) => Promise<void>;
  createOrder: (politicianId: string, data: any) => Promise<void>;
  fetchOrderAnalytics: (orderId: string) => Promise<void>;
}

export const usePoliticianStore = create<PoliticianState>((set) => ({
  politicianId: null,
  stats: null,
  orders: [],
  isLoading: false,
  error: null,

  fetchDashboard: async (politicianId: string) => {
    set({ isLoading: true, error: null, politicianId });
    try {
      const response = await politicianService.getPoliticianDashboard(
        politicianId
      );
      if (response.success) {
        set({ stats: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrders: async (politicianId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await politicianService.getPoliticianDashboard(
        politicianId
      );
      if (response.success) {
        set({ orders: response.data.recentOrders || [], isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createOrder: async (politicianId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await politicianService.createOrder(politicianId, data);
      if (response.success && response.data) {
        set((state) => ({
          orders: [...state.orders, response.data!],
          isLoading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrderAnalytics: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await politicianService.getOrderAnalytics(orderId);
      if (response.success) {
        // Store analytics in a separate property or update stats
        set({ isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
