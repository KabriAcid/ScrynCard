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
      // Mock gift validation - validate card code only (18 characters)
      // Serial number is just for physical card tracking, not for validation
      const validGifts: Record<string, any> = {
        // Airtime gifts (18-char card codes)
        "WSO-D939-39DX-39DK": {
          giftType: "airtime",
          amount: 5000,
          expiryDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        "GOE-K423-A997-Y432": {
          giftType: "airtime",
          amount: 10000,
          expiryDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        "MTN-X201-B904-Z847": {
          giftType: "airtime",
          amount: 2000,
          expiryDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        // Data gifts (18-char card codes)
        "AIR-T100-C203-D304": {
          giftType: "data",
          dataSize: 1000,
          amount: 1500,
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        "GLO-F400-E505-F606": {
          giftType: "data",
          dataSize: 5000,
          amount: 3500,
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        "NME-T500-G707-H808": {
          giftType: "data",
          dataSize: 500,
          amount: 800,
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
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
          expiryDate: gift.expiryDate,
          errorCode: undefined,
        };
      } else {
        set({
          error: "Invalid card code. Please check and try again.",
          isLoading: false,
        });
        return {
          success: false,
          error: "Invalid card code. Card not found in system.",
          errorCode: "VERIFICATION_FAILED",
        };
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return {
        success: false,
        error: error.message,
        errorCode: "VERIFICATION_ERROR",
      };
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
