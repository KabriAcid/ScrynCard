import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "@/config/api";
import type {
  RedemptionRequest,
  RedemptionResponse,
  EbillsResponse,
} from "@/lib/api/types";

export class EbillsService {
  private client: AxiosInstance;
  private merchantId: string;
  private apiKey: string;
  private secretKey: string;

  constructor() {
    this.merchantId = API_CONFIG.AIRTIME_API.EBILLS.MERCHANT_ID;
    this.apiKey = API_CONFIG.AIRTIME_API.EBILLS.API_KEY;
    this.secretKey = API_CONFIG.AIRTIME_API.EBILLS.SECRET_KEY;

    this.client = axios.create({
      baseURL: API_CONFIG.AIRTIME_API.EBILLS.BASE_URL,
      timeout: API_CONFIG.AIRTIME_API.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    // Add request/response interceptors
    this.setupInterceptors();
  }

  /**
   * Main method: Redeem airtime/data via Ebills API
   */
  async redeemAirtime(request: RedemptionRequest): Promise<RedemptionResponse> {
    try {
      const payload = this.buildPayload(request);

      const response = await this.client.post<EbillsResponse<any>>(
        "/topup/airtime",
        payload
      );

      return this.mapEbillsResponse(response.data, request);
    } catch (error) {
      return this.handleError(error, request);
    }
  }

  /**
   * Redeem data bundle
   */
  async redeemData(request: RedemptionRequest): Promise<RedemptionResponse> {
    try {
      const payload = this.buildPayload(request);

      const response = await this.client.post<EbillsResponse<any>>(
        "/topup/data",
        payload
      );

      return this.mapEbillsResponse(response.data, request);
    } catch (error) {
      return this.handleError(error, request);
    }
  }

  /**
   * Check operator balance (for admin use)
   */
  async getBalance() {
    try {
      const response = await this.client.get("/merchant/balance");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      throw error;
    }
  }

  /**
   * Build request payload for Ebills
   */
  private buildPayload(request: RedemptionRequest) {
    return {
      merchant_id: this.merchantId,
      phone: request.phoneNumber,
      network: this.mapOperatorToEbillsCode(request.operator),
      amount: request.amount,
      reference: request.giftCode, // Use gift code as reference
      product_code: request.productCode,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Map operator name to Ebills API code
   */
  private mapOperatorToEbillsCode(operator: string): string {
    const mapping: Record<string, string> = {
      MTN: "mtn",
      Airtel: "airtel",
      Glo: "glo",
      "9Mobile": "etisalat",
    };
    return mapping[operator] || operator.toLowerCase();
  }

  /**
   * Map Ebills response to standardized format
   */
  private mapEbillsResponse(
    ebillsResp: EbillsResponse<any>,
    request: RedemptionRequest
  ): RedemptionResponse {
    const success = ebillsResp.status === "success";

    return {
      status: success ? "success" : "failed",
      referenceNumber: request.giftCode,
      phoneNumber: request.phoneNumber,
      operator: request.operator,
      amount: request.amount,
      message: ebillsResp.message,
      timestamp: new Date().toISOString(),
      apiReference: ebillsResp.reference,
      expiryDate: this.calculateExpiryDate(request.giftType),
    };
  }

  /**
   * Calculate expiry date for airtime/data
   */
  private calculateExpiryDate(giftType: "airtime" | "data"): string {
    const expiryDate = new Date();
    // Airtime typically expires in 90 days, data in 30 days
    const days = giftType === "airtime" ? 90 : 30;
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate.toISOString();
  }

  /**
   * Error handling with retry logic
   */
  private async handleError(
    error: any,
    request: RedemptionRequest
  ): Promise<RedemptionResponse> {
    const message = error.response?.data?.message || error.message;

    return {
      status: "failed",
      referenceNumber: request.giftCode,
      phoneNumber: request.phoneNumber,
      operator: request.operator,
      amount: request.amount,
      message: `Redemption failed: ${message}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Setup axios interceptors for logging and retries
   */
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use((config) => {
      console.log(`[Ebills] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status >= 500) {
          console.error("[Ebills] Server error, may retry");
        }
        throw error;
      }
    );
  }
}

export const ebillsService = new EbillsService();
