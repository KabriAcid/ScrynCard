// Mobile Operator Type Definitions

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
