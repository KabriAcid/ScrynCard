// Scryn Platform Type Definitions

// Roles: Admin (super admin), Politician (authenticated), Guest (public - no auth needed for redemption)
export type UserRole = "admin" | "politician";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
export type CardStatus = "active" | "redeemed" | "expired" | "blocked";
export type RedemptionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";
export type FraudLevel = "low" | "medium" | "high" | "critical";

// User/Auth Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
}

export interface Politician extends User {
  party: string;
  position: string;
  state: string;
  lga: string;
  bvn: string;
  nin: string;
}

export interface Citizen {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  verified: boolean;
  createdAt: string;
  bvn: string;
  kycStatus: "pending" | "verified" | "rejected";
}

export interface Admin extends User {
  department: string;
  permissions: string[];
}

// Card Types
export interface ScratchCard {
  id: string;
  code: string;
  fullCode: string;
  denomination: number;
  status: CardStatus;
  orderId: string;
  redeemedAt?: string;
  redeemedBy?: string;
  createdAt: string;
}

// Order Types
export interface Order {
  id: string;
  politicianId: string;
  politician?: Politician;
  batchId: string;
  totalCardValue: number;
  serviceFee: number;
  printingCost: number;
  totalPaid: number;
  status: OrderStatus;
  cardCount: number;
  denominations: DenominationBreakdown[];
  paymentReference?: string;
  deliveredAt?: string;
  createdAt: string;
  expiresAt: string;
}

export interface DenominationBreakdown {
  amount: number;
  quantity: number;
  subtotal: number;
}

// Redemption Types
export interface Redemption {
  id: string;
  cardId: string;
  card?: ScratchCard;
  citizenId: string;
  citizen?: Citizen;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: RedemptionStatus;
  transferReference?: string;
  fraudScore: number;
  fraudFlags: string[];
  completedAt?: string;
  failureReason?: string;
  createdAt: string;
}

// Fraud Detection Types
export interface FraudCheck {
  id: string;
  redemptionId: string;
  riskScore: number;
  riskLevel: FraudLevel;
  flags: FraudFlag[];
  decision: "approved" | "pending_review" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface FraudFlag {
  code: string;
  description: string;
  severity: "low" | "medium" | "high";
}

// Analytics Types
export interface AdminStats {
  totalPoliticians: number;
  activeCampaigns: number;
  totalCardsCirculation: number;
  totalRedemptions: number;
  totalRedemptionAmount: number;
  openFraudAlerts: number;
  successRate: number;
}

export interface PoliticianStats {
  totalOrderValue: number;
  activeOrders: number;
  totalCardsDistributed: number;
  totalRedemptions: number;
  redemptionRate: number;
  totalRevenueGenerated: number;
}

export interface CitizenRedemptionStats {
  totalRedemptions: number;
  totalAmountReceived: number;
  successRate: number;
  averageProcessingTime: number;
}

// Dashboard Types
export interface DashboardKPI {
  icon: any;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
