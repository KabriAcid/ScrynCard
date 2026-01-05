// Ebills API Response Structures

export interface EbillsResponse<T> {
  status: "success" | "failed" | "pending";
  message: string;
  data?: T;
  reference?: string;
  timestamp: string;
}

export interface RedemptionRequest {
  phoneNumber: string;
  operator: string;
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
  operator: string;
  amount: number;
  message: string;
  timestamp: string;
  expiryDate?: string; // When airtime/data expires
  apiReference?: string; // Provider's reference
}

export interface OperatorBalance {
  operator: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}
