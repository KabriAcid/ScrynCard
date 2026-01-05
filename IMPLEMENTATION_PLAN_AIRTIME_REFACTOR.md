# Implementation Plan: Airtime/Data Redemption Refactor

## Ebills API Integration + Network Detection

**Date**: January 5, 2026  
**Scope**: Transform gift redemption system to use external telecom APIs  
**Standard**: RESTful architecture, dependency injection, error handling best practices

---

## 🏗️ Architecture Overview

```
User Input (Phone)
    ↓
Network Detection (Prefix → Operator)
    ↓
API Service Layer (Ebills/Provider)
    ↓
Redemption Processing
    ↓
Status Tracking & Notifications
```

---

## 📋 Phase 1: Types & Configuration

### 1.1 Network Detection Types

**File**: `src/lib/operators/types.ts` (NEW)

```typescript
// Telecom operator definitions with phone prefixes
export type MobileOperator = "MTN" | "Airtel" | "Glo" | "9Mobile";

export interface OperatorConfig {
  name: MobileOperator;
  prefixes: string[]; // e.g., ["0703", "0704", "0706"]
  displayName: string;
  color: string; // For UI
  apiProvider: "ebills" | "custom"; // Which API to use
  apiCode: string; // Provider's operator code
}

export interface NetworkDetectionResult {
  operator: MobileOperator;
  isValid: boolean;
  phoneNumber: string;
  errorMessage?: string;
}

export interface AirtimeProduct {
  id: string;
  operator: MobileOperator;
  amount: number; // ₦ value
  productCode: string; // Provider's product ID
  displayName: string; // "₦500 MTN Airtime"
  type: "airtime" | "data";
}

export interface DataBundle {
  id: string;
  operator: MobileOperator;
  size: string; // "100MB", "500MB", "1GB"
  sizeInMB: number;
  amount: number; // ₦ value
  productCode: string;
  displayName: string;
  validityDays: number;
}
```

### 1.2 API Response Types

**File**: `src/lib/api/types.ts` (NEW)

```typescript
// Ebills API response structures
export interface EbillsResponse<T> {
  status: "success" | "failed" | "pending";
  message: string;
  data?: T;
  reference?: string;
  timestamp: string;
}

export interface RedemptionRequest {
  phoneNumber: string;
  operator: MobileOperator;
  giftCode: string;
  giftType: "airtime" | "data";
  amount: number;
  productCode?: string;
  dataSize?: number; // MB for data bundles
}

export interface RedemptionResponse {
  status: "success" | "failed" | "pending";
  referenceNumber: string;
  phoneNumber: string;
  operator: MobileOperator;
  amount: number;
  message: string;
  timestamp: string;
  expiryDate?: string; // When airtime/data expires
  apiReference?: string; // Provider's reference
}

export interface OperatorBalance {
  operator: MobileOperator;
  balance: number;
  currency: string;
  lastUpdated: string;
}
```

### 1.3 Environment Configuration

**File**: `src/config/api.ts` (MODIFY)

```typescript
// Add new env variables for Ebills/providers
export const API_CONFIG = {
  // Existing configs...

  // NEW: Airtime/Data API Configuration
  AIRTIME_API: {
    PROVIDER: import.meta.env.VITE_AIRTIME_PROVIDER || "ebills", // "ebills" | "custom"
    EBILLS: {
      BASE_URL:
        import.meta.env.VITE_EBILLS_API_URL || "https://api.ebills.ng/v1",
      API_KEY: import.meta.env.VITE_EBILLS_API_KEY || "",
      MERCHANT_ID: import.meta.env.VITE_EBILLS_MERCHANT_ID || "",
      SECRET_KEY: import.meta.env.VITE_EBILLS_SECRET_KEY || "",
    },
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },

  // Network prefix mappings
  OPERATOR_PREFIXES: {
    MTN: ["0703", "0704", "0706", "0916"],
    Airtel: ["0701", "0708", "0802", "0808", "0812"],
    Glo: ["0705", "0807"],
    "9Mobile": ["0809", "0817"],
  },
} as const;
```

**File**: `.env.example` (ADD)

```env
# Airtime/Data Redemption API
VITE_AIRTIME_PROVIDER=ebills
VITE_EBILLS_API_URL=https://api.ebills.ng/v1
VITE_EBILLS_API_KEY=your_api_key_here
VITE_EBILLS_MERCHANT_ID=your_merchant_id_here
VITE_EBILLS_SECRET_KEY=your_secret_key_here
```

---

## 📍 Phase 2: Network Detection Service

### 2.1 Network Detection Logic

**File**: `src/lib/operators/networkDetector.ts` (NEW)

```typescript
import { API_CONFIG } from "@/config/api";
import type { MobileOperator, NetworkDetectionResult } from "./types";

export class NetworkDetector {
  /**
   * Detect mobile operator from phone number prefix
   * Supports: 0XXXXXXXXXX (Nigerian format)
   */
  static detect(phoneNumber: string): NetworkDetectionResult {
    // Clean phone number
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Validate Nigerian format
    if (!this.isValidNigerianNumber(cleaned)) {
      return {
        operator: "MTN",
        isValid: false,
        phoneNumber,
        errorMessage:
          "Invalid Nigerian phone number format. Use 0XXXXXXXXXX or +2340XXXXXXXXX",
      };
    }

    // Extract 4-digit prefix (e.g., "0703" from "07031234567")
    const prefix = cleaned.substring(0, 4);

    // Detect operator from prefix
    for (const [operator, prefixes] of Object.entries(
      API_CONFIG.OPERATOR_PREFIXES
    )) {
      if (prefixes.includes(prefix)) {
        return {
          operator: operator as MobileOperator,
          isValid: true,
          phoneNumber: this.formatPhoneNumber(cleaned),
        };
      }
    }

    return {
      operator: "MTN",
      isValid: false,
      phoneNumber,
      errorMessage: "Phone number does not match any known operator",
    };
  }

  /**
   * Validate Nigerian phone number format
   */
  private static isValidNigerianNumber(phoneNumber: string): boolean {
    // Must be exactly 11 digits starting with 0, or 13 digits starting with 234
    const regex = /^(0[789][0-1]\d{8}|234[789][0-1]\d{8})$/;
    return regex.test(phoneNumber);
  }

  /**
   * Format phone to standard 0XXXXXXXXXX format
   */
  private static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.startsWith("234")) {
      return "0" + cleaned.substring(3);
    }

    return cleaned.startsWith("0") ? cleaned : "0" + cleaned;
  }

  /**
   * Get all operators (for UI dropdowns)
   */
  static getAllOperators(): MobileOperator[] {
    return Object.keys(API_CONFIG.OPERATOR_PREFIXES) as MobileOperator[];
  }
}
```

### 2.2 Test Network Detector

**File**: `src/lib/operators/__tests__/networkDetector.test.ts`

```typescript
import { NetworkDetector } from "../networkDetector";

describe("NetworkDetector", () => {
  test("detects MTN from prefix 0703", () => {
    const result = NetworkDetector.detect("07031234567");
    expect(result.operator).toBe("MTN");
    expect(result.isValid).toBe(true);
  });

  test("detects Airtel from prefix 0701", () => {
    const result = NetworkDetector.detect("07011234567");
    expect(result.operator).toBe("Airtel");
    expect(result.isValid).toBe(true);
  });

  test("rejects invalid format", () => {
    const result = NetworkDetector.detect("1234567890");
    expect(result.isValid).toBe(false);
  });

  test("handles +234 format", () => {
    const result = NetworkDetector.detect("+2347031234567");
    expect(result.operator).toBe("MTN");
    expect(result.isValid).toBe(true);
  });
});
```

---

## 🔌 Phase 3: API Service Layer

### 3.1 Ebills Service (Provider Implementation)

**File**: `src/services/providers/ebillsService.ts` (NEW)

```typescript
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
```

### 3.2 Abstracted Airtime Service (Provider-Agnostic)

**File**: `src/services/airtimeService.ts` (NEW)

```typescript
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
```

---

## 🗄️ Phase 4: Data Models Update

### 4.1 Update Type Definitions

**File**: `src/lib/mockTypes.ts` (MODIFY)

```typescript
// BEFORE: Line 94-116 (Redemption interface)
// AFTER:

export interface Redemption {
  id: string;
  cardId: string;
  card?: ScratchCard;
  citizenId?: string;
  phoneNumber: string; // Primary identifier
  mobileOperator: MobileOperator; // NEW: Auto-detected from phone
  giftType: "airtime" | "data";
  amount: number;
  dataSize?: number;
  status: RedemptionStatus;
  operatorReference?: string; // Ebills/Provider reference
  fraudScore: number;
  fraudFlags: string[];
  completedAt?: string;
  failureReason?: string;
  expiryDate?: string; // When airtime/data expires
  createdAt: string;

  // Removed fields:
  // bankName, accountNumber, accountName, transferReference
  // bvn, dob, favoriteParty, hasVotersCard
}

// Add import at top
import type { MobileOperator } from "./operators/types";
```

### 4.2 Update ScratchCard

**File**: `src/lib/mockTypes.ts` (MODIFY)

```typescript
export interface ScratchCard {
  id: string;
  serialNumber: string;
  giftCode: string;
  denomination: number;
  giftType: "airtime" | "data";
  dataSize?: number;
  status: CardStatus;
  orderId: string;
  mobileOperator?: MobileOperator; // NEW: Can be pre-assigned to operator
  redeemedAt?: string;
  redeemedBy?: string; // Phone number or citizen ID
  expiryDate?: string; // When gift code expires
  createdAt: string;
}
```

---

## 🎯 Phase 5: Citizen Redemption Flow Update

### 5.1 Update Redemption Schema

**File**: `src/features/citizen/components/redemption/schema.ts` (MODIFY)

```typescript
import { z } from "zod";
import { NetworkDetector } from "@/lib/operators/networkDetector";

export const RedemptionSchema = z.object({
  giftCode: z.string().min(5, "Gift code is required").toUpperCase(),

  phoneNumber: z
    .string()
    .min(11, "Phone number must be valid Nigerian format")
    .refine((phone) => {
      const result = NetworkDetector.detect(phone);
      return result.isValid;
    }, "Invalid Nigerian phone number. Use 0XXXXXXXXXX format"),

  // REMOVED: bankName, accountNumber, accountName, BVN
  // REMOVED: favoriteParty, hasVotersCard, location fields
});

export type RedemptionFormValues = z.infer<typeof RedemptionSchema>;

export const STEPS = [
  {
    id: 1,
    title: "Verify Gift",
    description: "Enter your gift code",
  },
  {
    id: 2,
    title: "Phone Number",
    description: "Verify your phone number",
  },
  {
    id: 3,
    title: "Confirm",
    description: "Confirm redemption",
  },
];
```

### 5.2 Create New PhoneVerificationStep

**File**: `src/features/citizen/components/redemption/PhoneVerificationStep.tsx` (NEW)

```typescript
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NetworkDetector } from "@/lib/operators/networkDetector";
import type { RedemptionFormValues } from "./schema";
import { AlertCircle, Smartphone, CheckCircle } from "lucide-react";

export function PhoneVerificationStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RedemptionFormValues>();
  const phoneNumber = watch("phoneNumber");
  const [detectedOperator, setDetectedOperator] = useState<string | null>(null);

  useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 11) {
      const result = NetworkDetector.detect(phoneNumber);
      setDetectedOperator(result.isValid ? result.operator : null);
    }
  }, [phoneNumber]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Verify Phone Number
        </CardTitle>
        <CardDescription>
          Enter the phone number to receive your airtime/data
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="0703 123 4567"
                {...watch("phoneNumber")}
                onChange={(e) => setValue("phoneNumber", e.target.value)}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
            </div>
            {detectedOperator && (
              <Badge variant="outline" className="h-10 px-3">
                {detectedOperator}
              </Badge>
            )}
          </div>
          {errors.phoneNumber && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.phoneNumber.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {detectedOperator && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Valid {detectedOperator} number detected
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 p-3 rounded text-sm text-blue-900">
          💡 Your airtime/data will be credited to{" "}
          <strong>{detectedOperator || "your network"}</strong>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5.3 Update Redemption Flow

**File**: `src/features/citizen/pages/RedeemPage.tsx` (MODIFY)

```typescript
// Update flow to:
// 1. CardVerificationStep (validate gift code)
// 2. PhoneVerificationStep (get phone + operator detected)
// 3. ConfirmationStep (show what will be redeemed)
// 4. Call AirtimeService.redeem()

// Example onSubmit logic:
const onSubmit = async (data: RedemptionFormValues) => {
  setIsProcessing(true);
  try {
    const response = await AirtimeService.redeem(
      data.phoneNumber,
      data.giftCode,
      giftType, // from gift code validation step
      giftAmount // from gift code validation step
    );

    if (response.status === "success") {
      setStep("success");
      setRedemptionResult(response);
    } else {
      showError(response.message);
    }
  } catch (error) {
    showError("Redemption failed. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};
```

### 5.4 Update Success Confirmation

**File**: `src/features/citizen/components/redemption/SuccessConfirmation.tsx` (MODIFY)

```typescript
// Update display to show:
// ✅ ₦5,000 MTN Airtime redeemed
// ✅ Phone: 0908765XXXX
// ✅ Reference: SRN-XXXXXXXXXX
// ✅ Expires: January 15, 2026
//
// Remove: Bank details, voter info, personal info
```

---

## 🏪 Phase 6: Mock Data & Testing

### 6.1 Update Mock Redemptions

**File**: `src/lib/mock/redemptions.ts` (MODIFY)

```typescript
export const mockRedemptions: Redemption[] = [
  {
    id: generateId("RED"),
    cardId: mockScratchCards[0].id,
    card: mockScratchCards[0],
    phoneNumber: "08067234567",
    mobileOperator: "MTN",
    giftType: "airtime",
    amount: 5000,
    status: "completed",
    operatorReference: "MTN-20240115-X7F9K2",
    fraudScore: 15,
    fraudFlags: [],
    completedAt: new Date(2024, 2, 20).toISOString(),
    expiryDate: new Date(2024, 5, 20).toISOString(), // 90 days
    createdAt: new Date(2024, 2, 20).toISOString(),
  },
  // ... more samples with different operators
];
```

### 6.2 Test Airtime Service

**File**: `src/services/__tests__/airtimeService.test.ts` (NEW)

```typescript
import { AirtimeService } from "../airtimeService";
import { NetworkDetector } from "@/lib/operators/networkDetector";

describe("AirtimeService", () => {
  test("validates phone number and detects operator", () => {
    const result = AirtimeService.validatePhoneNumber("08067234567");
    expect(result.isValid).toBe(true);
    expect(result.operator).toBe("MTN");
  });

  test("detects Airtel network", () => {
    const result = AirtimeService.validatePhoneNumber("07011234567");
    expect(result.operator).toBe("Airtel");
  });

  test("rejects invalid phone numbers", () => {
    const result = AirtimeService.validatePhoneNumber("1234567890");
    expect(result.isValid).toBe(false);
  });

  // Integration tests would mock Ebills API responses
  test("should call Ebills API with correct payload", async () => {
    // Mock implementation
  });
});
```

---

## 🎨 Phase 7: Update UI Components

### 7.1 Update RedemptionDetails

**File**: `src/features/politician/pages/RedemptionDetails.tsx` (MODIFY)

```typescript
// Remove sections:
- Bank details section
- Personal info section
- Voter card info

// Keep/Update sections:
+ Phone number (masked: 0908765XXXX)
+ Mobile operator (with badge)
+ Gift type (Airtime/Data)
+ Amount (₦5,000 MTN Airtime)
+ Operator reference (EBL-XXX)
+ Expiry date
+ Status timeline
```

### 7.2 Update Politician Redemption Page

**File**: `src/features/politician/pages/Redemption.tsx` (MODIFY)

```typescript
// Table columns:
- Date
- Gift Type (Airtime/Data with icon)
- Amount
- Operator (with badge color)
- Phone (masked)
- Status
- Reference

// Metrics:
- Total gifts redeemed
- By operator breakdown (pie chart)
- Success rate by operator
- Avg redemption time
```

---

## 🔄 Phase 8: Store Updates

### 8.1 Update Citizen Store

**File**: `src/stores/citizenStore.ts` (MODIFY)

```typescript
import { AirtimeService } from "@/services/airtimeService";

interface CitizenState {
  // ... existing fields
  redeemGift: async (giftCode: string, phoneNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      // Step 1: Validate gift code and get amount/type
      const giftValidation = await validateGiftCode(giftCode);

      // Step 2: Call AirtimeService which handles network detection
      const response = await AirtimeService.redeem(
        phoneNumber,
        giftCode,
        giftValidation.giftType,
        giftValidation.amount
      );

      if (response.status === "success") {
        set({
          currentRedemption: response,
          isLoading: false,
        });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}
```

---

## 📊 Phase 9: Error Handling & Logging

### 9.1 Create Error Handler

**File**: `src/lib/errors/redemptionErrors.ts` (NEW)

```typescript
export class RedemptionError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: any
  ) {
    super(message);
  }
}

export const REDEMPTION_ERRORS = {
  INVALID_PHONE: {
    code: "INVALID_PHONE",
    message: "Invalid phone number format",
  },
  NETWORK_DETECTION_FAILED: {
    code: "NETWORK_FAILED",
    message: "Unable to detect mobile operator",
  },
  INVALID_GIFT_CODE: {
    code: "INVALID_CODE",
    message: "Gift code is invalid or expired",
  },
  API_ERROR: { code: "API_ERROR", message: "Redemption service error" },
  DUPLICATE_REDEMPTION: {
    code: "DUPLICATE",
    message: "This gift code has already been redeemed",
  },
  OPERATOR_UNAVAILABLE: {
    code: "OPERATOR_DOWN",
    message: "Mobile operator service temporarily unavailable",
  },
};
```

### 9.2 Add Logging Service

**File**: `src/services/loggingService.ts` (NEW)

```typescript
export class RedemptionLogger {
  static logRedemptionAttempt(
    giftCode: string,
    phoneNumber: string,
    operator: string
  ) {
    console.log(
      `[REDEMPTION] Attempting: ${giftCode} → ${phoneNumber} (${operator})`
    );
  }

  static logRedemptionSuccess(giftCode: string, reference: string) {
    console.log(`[REDEMPTION] Success: ${giftCode} → ${reference}`);
  }

  static logRedemptionFailure(giftCode: string, error: string) {
    console.error(`[REDEMPTION] Failed: ${giftCode} - ${error}`);
  }
}
```

---

## ✅ Implementation Checklist

### Phase 1: Setup

- [ ] Create `src/lib/operators/types.ts`
- [ ] Create `src/lib/api/types.ts`
- [ ] Update `src/config/api.ts` with Ebills config
- [ ] Add `.env` variables

### Phase 2: Network Detection

- [ ] Create `src/lib/operators/networkDetector.ts`
- [ ] Add unit tests for detector
- [ ] Test all 4 operators (MTN, Airtel, Glo, 9Mobile)

### Phase 3: API Service

- [ ] Create `src/services/providers/ebillsService.ts`
- [ ] Create `src/services/airtimeService.ts`
- [ ] Add error handling & logging
- [ ] Test with mock API responses

### Phase 4: Data Models

- [ ] Update `src/lib/mockTypes.ts` - Redemption interface
- [ ] Update `src/lib/mockTypes.ts` - ScratchCard interface
- [ ] Update mock data

### Phase 5: UI Components

- [ ] Update redemption schema validation
- [ ] Create `PhoneVerificationStep.tsx`
- [ ] Update `RedeemPage.tsx` flow
- [ ] Update success confirmation messaging

### Phase 6: Politician Dashboard

- [ ] Update `RedemptionDetails.tsx`
- [ ] Update `Redemption.tsx` table & metrics
- [ ] Update `OrderDetails.tsx` with operator info

### Phase 7: Admin Dashboard

- [ ] Update analytics with operator breakdown
- [ ] Add operator-specific metrics
- [ ] Update fraud detection rules

### Phase 8: Testing

- [ ] Unit tests for NetworkDetector
- [ ] Unit tests for AirtimeService
- [ ] Integration tests with mock API
- [ ] E2E tests for redemption flow

### Phase 9: Deployment

- [ ] Add Ebills credentials to production env
- [ ] Test with actual API
- [ ] Monitor error logs
- [ ] Setup alerts for failed redemptions

---

## 🚀 Deployment Strategy

### Development

```bash
# Use mock Ebills responses
VITE_AIRTIME_PROVIDER=ebills (mocked)
```

### Production

```bash
# Connect to real Ebills API
VITE_AIRTIME_PROVIDER=ebills (real)
VITE_EBILLS_API_KEY=***
VITE_EBILLS_MERCHANT_ID=***
VITE_EBILLS_SECRET_KEY=***
```

---

## 📈 Future Enhancements

1. **Additional Providers**: Add Flutterwave, Paystack, other API providers
2. **Batch Redemptions**: Process multiple gift codes at once
3. **Webhook Integration**: Receive redemption status updates from Ebills
4. **Rate Limiting**: Prevent abuse (e.g., 5 redemptions per phone per day)
5. **Analytics**: Track operator performance, redemption success rates
6. **Retry Logic**: Automatic retry on network failures
7. **Balance Alerts**: Notify admin when operator balance is low
8. **Provider Switching**: Fallback to secondary provider if primary is down

---

## 📝 Summary

**Standard approach**:

- ✅ Network detection from phone prefix (simple, reliable)
- ✅ Abstracted service layer (easy to add providers)
- ✅ Type-safe with TypeScript
- ✅ Proper error handling & logging
- ✅ Testable architecture
- ✅ SOLID principles (Single Responsibility, Dependency Inversion)

**Timeline**: 7-10 days for complete implementation
**Effort**: ~50-60 hours

**Key files to create**: 8 new files  
**Key files to modify**: 15+ existing files
