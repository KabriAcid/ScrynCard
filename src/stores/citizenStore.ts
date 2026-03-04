import { create } from "zustand";
import { Redemption } from "@/lib/mockTypes";
import { AirtimeService } from "@/services/airtimeService";

interface CitizenState {
  citizenId: string | null;
  redemptions: Redemption[];
  currentRedemption: Redemption | null;
  isLoading: boolean;
  error: string | null;
  validateGift: (giftCode: string) => Promise<{
    success: boolean;
    giftType?: "airtime" | "data";
    amount?: number;
    dataSize?: number;
    error?: string;
    errorCode?: string;
  }>;
  redeemGift: (
    giftCode: string,
    phoneNumber: string,
    network: string,
  ) => Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }>;
  resetError: () => void;
}

export const useCitizenStore = create<CitizenState>((set) => ({
  citizenId: null,
  redemptions: [],
  currentRedemption: null,
  isLoading: false,
  error: null,

  validateGift: async (giftCode: string) => {
    set({ isLoading: true, error: null });
    try {
      // Validate card prefix - first three characters must not contain numbers
      const prefix = giftCode.substring(0, 3);
      if (/\d/.test(prefix)) {
        set({
          error: "Invalid card code. Card prefix contains invalid characters.",
          isLoading: false,
        });
        return {
          success: false,
          error: "Invalid card code. Card prefix contains invalid characters.",
          errorCode: "INVALID_PREFIX",
        };
      }

      // If prefix is valid (no numbers), the card is valid
      // Determine gift type based on prefix
      const prefixLower = prefix.toLowerCase();
      // Top 4 Nigerian network operators
      const nigerianOperators = ["mtn", "air", "glo", "9mo"];

      let giftType: "airtime" | "data" = "airtime";
      let amount = 5000;
      let dataSize = 1000;

      // Randomly assign gift type (50% airtime, 50% data)
      // In production, this would be determined by the actual card's gift type
      if (Math.random() > 0.5) {
        giftType = "data";
        amount = 2000;
        dataSize = 2000;
      } else {
        giftType = "airtime";
        amount = 5000;
      }

      set({ isLoading: false });
      return {
        success: true,
        giftType,
        amount,
        dataSize,
        errorCode: undefined,
      };
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return {
        success: false,
        error: error.message,
        errorCode: "VERIFICATION_ERROR",
      };
    }
  },

  redeemGift: async (
    giftCode: string,
    phoneNumber: string,
    network: string,
  ) => {
    set({ isLoading: true, error: null });
    try {
      // Step 1: Validate phone number format (basic)
      if (
        !phoneNumber ||
        phoneNumber.length !== 11 ||
        !phoneNumber.startsWith("0")
      ) {
        set({
          error: "Invalid phone number format",
          isLoading: false,
        });
        return {
          success: false,
          error: "Invalid phone number format",
        };
      }

      // Simulate gift type/amount - in production this comes from the validated card
      const giftType: "airtime" | "data" = "airtime";
      const amount = 100;

      // Step 3: Call AirtimeService to redeem
      const response = await AirtimeService.redeem(
        phoneNumber,
        giftCode,
        giftType,
        network,
        amount,
      );

      if (response.status === "success") {
        set((state) => ({
          currentRedemption: response as any,
          redemptions: [...state.redemptions, response as any],
          isLoading: false,
        }));
        return {
          success: true,
        };
      } else {
        set({
          error: response.message || "Redemption failed",
          isLoading: false,
        });
        return {
          success: false,
          error: response.message || "Redemption failed",
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred";
      set({ error: errorMessage, isLoading: false });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));
