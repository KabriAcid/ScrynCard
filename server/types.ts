export type GiftType = "airtime" | "data";

export interface DemoCard {
  serialNumber: string;
  cardCode: string;
  giftType: GiftType;
  amount?: number;
  dataSizeMb?: number;
}

export interface ProviderPlan {
  id: string;
  name: string;
  price: string;
  telco_price?: string;
}

export interface RedemptionResult {
  status: "success" | "pending" | "failed";
  referenceNumber: string;
  phoneNumber: string;
  operator: string;
  amount: number;
  dataSizeMb?: number;
  message: string;
  timestamp: string;
  apiReference?: string;
}
