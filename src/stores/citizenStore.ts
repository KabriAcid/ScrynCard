import { create } from "zustand";
import { Redemption } from "@/lib/mockTypes";
import { AirtimeService } from "@/services/airtimeService";
import { NetworkDetector } from "@/lib/operators";

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
  }>;
  redeemGift: (giftCode: string, phoneNumber: string) => Promise<void>;
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
      // Simulate gift validation
      // In production, this would validate against backend
      const validGifts: Record<string, any> = {
        "MTN-5K-B001-A3F7B9C2-X7": {
          giftType: "airtime",
          amount: 5000,
        },
        "AIRTEL-1GB-B001-C0D3E5F7-X8": {
          giftType: "data",
          amount: 1000,
          dataSize: 1000,
        },
        "GLO-2K-B001-F6A7B8C9-X9": {
          giftType: "airtime",
          amount: 2000,
        },
        "9MOBILE-500MB-B002-D1E4F6A7-X0": {
          giftType: "data",
          amount: 1500,
          dataSize: 500,
        },
        "MTN-10K-B002-B8C9D0E1-X1": {
          giftType: "airtime",
          amount: 10000,
        },
      };

      const gift = validGifts[giftCode.toUpperCase()];

      if (gift) {
        set({ isLoading: false });
        return {
          success: true,
          giftType: gift.giftType,
          amount: gift.amount,
          dataSize: gift.dataSize,
        };
      } else {
        set({
          error: "Invalid gift code. Please check and try again.",
          isLoading: false,
        });
        return {
          success: false,
          error: "Invalid gift code",
        };
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  redeemGift: async (giftCode: string, phoneNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      // Step 1: Validate phone number
      const phoneValidation = NetworkDetector.detect(phoneNumber);
      if (!phoneValidation.isValid) {
        set({
          error: phoneValidation.errorMessage || "Invalid phone number",
          isLoading: false,
        });
        return;
      }

      // Step 2: Validate gift code
      const giftValidation = await (set as any)((state: CitizenState) =>
        state.validateGift(giftCode)
      );

      if (!giftValidation.success) {
        set({
          error: giftValidation.error || "Invalid gift code",
          isLoading: false,
        });
        return;
      }

      // Step 3: Call AirtimeService to redeem
      const response = await AirtimeService.redeem(
        phoneValidation.phoneNumber,
        giftCode,
        giftValidation.giftType,
        giftValidation.amount
      );

      if (response.status === "success") {
        set((state) => ({
          currentRedemption: response as any,
          redemptions: [...state.redemptions, response as any],
          isLoading: false,
        }));
      } else {
        set({
          error: response.message || "Redemption failed",
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred", isLoading: false });
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));

  resetError: () => {
    set({ error: null });
  },
}));
