import { ebillsService } from "./providers/ebillsService";
import type { RedemptionRequest, RedemptionResponse } from "@/lib/api/types";
import { API_CONFIG } from "@/config/api";

/**
 * Abstracted service layer for airtime/data redemption
 * Supports multiple providers (currently Ebills, easily extensible)
 */
export class AirtimeService {
  /**
   * Main redemption method - handles network and API call
   */
  static async redeem(
    phoneNumber: string,
    giftCode: string,
    giftType: "airtime" | "data",
    network: string,
    amount?: number
  ): Promise<RedemptionResponse> {
    try {
      // Development/Mock Mode: Return success if no API keys configured
      const apiKey = API_CONFIG.AIRTIME_API.EBILLS.API_KEY;
      if (!apiKey || import.meta.env.DEV) {
        console.log("🔧 Mock redemption mode - returning success");
        return {
          status: "success",
          referenceNumber: giftCode,
          phoneNumber,
          operator: network as any,
          amount: amount || 0,
          message: "Redemption successful (mock mode)",
          timestamp: new Date().toISOString(),
          apiReference: `MOCK-${Date.now()}`,
          expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        };
      }

      // Step 1: Validate phone number format
      if (!phoneNumber || phoneNumber.length !== 11 || !phoneNumber.startsWith('0')) {
        return {
          status: "failed",
          referenceNumber: giftCode,
          phoneNumber,
          operator: network as any,
          amount: amount || 0,
          message: "Invalid phone number format",
          timestamp: new Date().toISOString(),
        };
      }

      // Step 2: Build request object
      const request: RedemptionRequest = {
        phoneNumber,
        operator: network as any,
        giftCode,
        giftType,
        amount: amount || 0,
      };

      // Step 3: Route to appropriate provider
      const provider = API_CONFIG.AIRTIME_API.PROVIDER;

      if (provider === "ebills") {
        if (giftType === "airtime") {
          return await ebillsService.redeemAirtime(request);
        } else {
          return await ebillsService.redeemData(request);
        }
      }

      throw new Error(`Unknown provider: ${provider}`);
    } catch (error: any) {
      return {
        status: "failed",
        referenceNumber: giftCode,
        phoneNumber,
        operator: network as any,
        amount: amount || 0,
        message: error.message || "Redemption service error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get operator balance (admin use)
   */
  static async getBalance() {
    const provider = API_CONFIG.AIRTIME_API.PROVIDER;
    if (provider === "ebills") {
      return await ebillsService.getBalance();
    }
  }
}
