import { ebillsService } from "./providers/ebillsService";
import type { RedemptionRequest, RedemptionResponse } from "@/lib/api/types";
import { NetworkDetector } from "@/lib/operators/networkDetector";
import { API_CONFIG } from "@/config/api";

/**
 * Abstracted service layer for airtime/data redemption
 * Supports multiple providers (currently Ebills, easily extensible)
 */
export class AirtimeService {
  /**
   * Main redemption method - handles network detection and API call
   */
  static async redeem(
    phoneNumber: string,
    giftCode: string,
    giftType: "airtime" | "data",
    amount?: number
  ): Promise<RedemptionResponse> {
    try {
      // Step 1: Detect network operator from phone number
      const networkResult = NetworkDetector.detect(phoneNumber);

      if (!networkResult.isValid) {
        return {
          status: "failed",
          referenceNumber: giftCode,
          phoneNumber,
          operator: "MTN",
          amount: amount || 0,
          message: networkResult.errorMessage || "Invalid phone number",
          timestamp: new Date().toISOString(),
        };
      }

      // Step 2: Build request object
      const request: RedemptionRequest = {
        phoneNumber: networkResult.phoneNumber,
        operator: networkResult.operator,
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
        operator: "MTN",
        amount: amount || 0,
        message: error.message || "Redemption service error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Validate phone number without redeeming
   */
  static validatePhoneNumber(phoneNumber: string) {
    return NetworkDetector.detect(phoneNumber);
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
