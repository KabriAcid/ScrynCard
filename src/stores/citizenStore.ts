import { create } from "zustand";
import { Redemption } from "@/lib/mockTypes";
import { citizenService } from "@/services/mockService";

interface CitizenState {
  citizenId: string | null;
  redemptions: Redemption[];
  currentRedemption: Redemption | null;
  isLoading: boolean;
  error: string | null;
  validateCard: (cardCode: string) => Promise<void>;
  redeemCard: (cardCode: string, citizenData: any) => Promise<void>;
  getRedemptionStatus: (redemptionId: string) => Promise<void>;
  resetError: () => void;
}

export const useCitizenStore = create<CitizenState>((set) => ({
  citizenId: null,
  redemptions: [],
  currentRedemption: null,
  isLoading: false,
  error: null,

  validateCard: async (cardCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await citizenService.validateCard(cardCode);
      if (!response.success) {
        set({ error: response.error || "Invalid card", isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  redeemCard: async (cardCode: string, citizenData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await citizenService.redeemCard(cardCode, citizenData);
      if (response.success && response.data) {
        set({
          currentRedemption: response.data,
          redemptions: [
            ...(set as any)((state: CitizenState) => state.redemptions),
            response.data,
          ],
          isLoading: false,
        });
      } else {
        set({ error: response.error || "Redemption failed", isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getRedemptionStatus: async (redemptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await citizenService.getRedemptionStatus(redemptionId);
      if (response.success && response.data) {
        set({ currentRedemption: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));
