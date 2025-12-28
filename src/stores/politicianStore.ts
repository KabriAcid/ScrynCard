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
  fetchOrders: (politicianId: string) => Promise<Order[]>;
  createOrder: (politicianId: string, data: any) => Promise<void>;
  fetchOrderAnalytics: (orderId: string) => Promise<void>;
}

export const usePoliticianStore = create<PoliticianState>((set) => ({
  politicianId: null,
  stats: null,
  orders: [],
  isLoading: true,
  error: null,

  fetchDashboard: async (politicianId: string) => {
    set({ isLoading: true, error: null, politicianId });
    try {
      const response = await politicianService.getPoliticianDashboard(
        politicianId
      );
      if (response.success) {
        set({ stats: response.data, isLoading: false });
      } else {
        set({
          error: response.error || "Failed to fetch dashboard",
          isLoading: false,
        });
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
        const orders = response.data?.recentOrders || [];
        set({ orders, isLoading: false });
        return orders;
      } else {
        set({
          error: response.error || "Failed to fetch orders",
          isLoading: false,
        });
        return [];
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
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
      } else {
        set({
          error: response.error || "Failed to create order",
          isLoading: false,
        });
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
      } else {
        set({
          error: response.error || "Failed to fetch analytics",
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
