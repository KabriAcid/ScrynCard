import {
  AdminStats,
  Order,
  Politician,
  Redemption,
  FraudCheck,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/mockTypes";
import {
  mockPoliticians,
  mockOrders,
  mockRedemptions,
  mockFraudChecks,
  generateAdminStats,
  getRecentRedemptions,
  getRecentOrders,
} from "@/lib/mockData";

// Simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Admin Services
export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    await delay();
    return {
      success: true,
      data: generateAdminStats(),
    };
  },

  async getAllPoliticians(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Politician>> {
    await delay();
    const start = (page - 1) * limit;
    const data = mockPoliticians.slice(start, start + limit);
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: mockPoliticians.length,
        pages: Math.ceil(mockPoliticians.length / limit),
      },
    };
  },

  async getPoliticianDetails(id: string): Promise<ApiResponse<Politician>> {
    await delay();
    const politician = mockPoliticians.find((p) => p.id === id);
    if (!politician) {
      return { success: false, error: "Politician not found" };
    }
    return { success: true, data: politician };
  },

  async getAllOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Order>> {
    await delay();
    const start = (page - 1) * limit;
    const data = mockOrders.slice(start, start + limit);
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: mockOrders.length,
        pages: Math.ceil(mockOrders.length / limit),
      },
    };
  },

  async getOrderDetails(id: string): Promise<ApiResponse<Order>> {
    await delay();
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    return { success: true, data: order };
  },

  async getAllRedemptions(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Redemption>> {
    await delay();
    const start = (page - 1) * limit;
    const data = mockRedemptions.slice(start, start + limit);
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: mockRedemptions.length,
        pages: Math.ceil(mockRedemptions.length / limit),
      },
    };
  },

  async getFraudAlerts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<FraudCheck>> {
    await delay();
    const alerts = mockFraudChecks.filter(
      (f) => f.decision === "pending_review"
    );
    const start = (page - 1) * limit;
    const data = alerts.slice(start, start + limit);
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: alerts.length,
        pages: Math.ceil(alerts.length / limit),
      },
    };
  },

  async reviewFraudCase(
    fraudId: string,
    decision: "approved" | "rejected"
  ): Promise<ApiResponse<FraudCheck>> {
    await delay();
    const fraudCheck = mockFraudChecks.find((f) => f.id === fraudId);
    if (!fraudCheck) {
      return { success: false, error: "Fraud check not found" };
    }
    fraudCheck.decision = decision === "approved" ? "approved" : "rejected";
    fraudCheck.reviewedAt = new Date().toISOString();
    return { success: true, data: fraudCheck };
  },
};

// Politician Services
export const politicianService = {
  async getPoliticianDashboard(politicianId: string) {
    await delay();
    // Try to find politician by ID first, then by using the first politician as demo
    let politician = mockPoliticians.find((p) => p.id === politicianId);

    // If not found by ID, use the first politician for demo purposes
    if (!politician) {
      politician = mockPoliticians[0];
    }

    if (!politician) {
      return { success: false, error: "Politician not found" };
    }

    // Use all mockOrders for demo (since we're using mockPoliticians[0] as demo)
    const politicianOrders = mockOrders;
    const totalOrderValue = politicianOrders.reduce(
      (sum, o) => sum + o.totalCardValue,
      0
    );

    // Calculate total redemptions from mockRedemptions
    const totalRedemptions = mockRedemptions.length;
    const completedRedemptions = mockRedemptions.filter(
      (r) => r.status === "completed"
    ).length;

    return {
      success: true,
      data: {
        politician,
        stats: {
          totalOrderValue,
          activeOrders: politicianOrders.filter(
            (o) => o.status === "processing"
          ).length,
          totalOrders: politicianOrders.length,
          totalRedemptions: completedRedemptions,
          redemptionRate:
            totalRedemptions > 0
              ? (completedRedemptions / totalRedemptions) * 100
              : 0,
        },
        recentOrders: getRecentOrders(10),
      },
    };
  },

  async createOrder(
    politicianId: string,
    data: any
  ): Promise<ApiResponse<Order>> {
    await delay(1000);
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      politicianId,
      batchId: `BATCH-${Date.now()}`,
      totalCardValue: data.totalCardValue,
      serviceFee: data.totalCardValue * 0.1,
      printingCost: data.totalCardValue * 0.0426,
      totalPaid:
        data.totalCardValue +
        data.totalCardValue * 0.1 +
        data.totalCardValue * 0.0426,
      status: "pending",
      cardCount: data.cardCount || 10000,
      denominations: data.denominations || [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    mockOrders.push(newOrder);
    return { success: true, data: newOrder };
  },

  async getOrderAnalytics(orderId: string) {
    await delay();
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    return {
      success: true,
      data: {
        order,
        analytics: {
          totalDistributed: order.cardCount,
          totalRedeemed: Math.floor(order.cardCount * 0.65),
          pendingRedemption: Math.floor(order.cardCount * 0.25),
          redemptionRate: 65,
        },
      },
    };
  },
};

// Citizen Services
export const citizenService = {
  async validateCard(cardCode: string): Promise<ApiResponse<any>> {
    await delay(500);
    const card = mockScratchCards.find((c) => c.code === cardCode);
    if (!card) {
      return { success: false, error: "Invalid card code" };
    }
    if (card.status === "redeemed") {
      return { success: false, error: "Card already redeemed" };
    }
    return {
      success: true,
      data: {
        valid: true,
        denomination: card.denomination,
        cardCode,
      },
    };
  },

  async redeemCard(
    cardCode: string,
    citizenData: any
  ): Promise<ApiResponse<Redemption>> {
    await delay(2000);
    const card = mockScratchCards.find((c) => c.code === cardCode);
    if (!card) {
      return { success: false, error: "Card not found" };
    }

    // Simulate fraud detection
    const fraudScore = Math.floor(Math.random() * 100);
    const newRedemption: Redemption = {
      id: `RED-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      cardId: card.id,
      card,
      citizenId: `CIT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      amount: card.denomination,
      bankName: citizenData.bankName,
      accountNumber: citizenData.accountNumber,
      accountName: citizenData.accountName,
      status: fraudScore > 70 ? "failed" : "processing",
      fraudScore,
      fraudFlags:
        fraudScore > 70
          ? ["FRAUD_DETECTED", "SUSPICIOUS_PATTERN"]
          : ["VELOCITY_CHECK"],
      createdAt: new Date().toISOString(),
    };

    if (newRedemption.status === "processing") {
      card.status = "redeemed";
      card.redeemedAt = new Date().toISOString();
    }

    mockRedemptions.push(newRedemption);
    return { success: true, data: newRedemption };
  },

  async getRedemptionStatus(
    redemptionId: string
  ): Promise<ApiResponse<Redemption>> {
    await delay();
    const redemption = mockRedemptions.find((r) => r.id === redemptionId);
    if (!redemption) {
      return { success: false, error: "Redemption not found" };
    }
    return { success: true, data: redemption };
  },
};

// Card Services
export const cardService = {
  async getCardDetails(cardCode: string) {
    await delay();
    const card = mockScratchCards.find((c) => c.code === cardCode);
    if (!card) {
      return { success: false, error: "Card not found" };
    }
    return { success: true, data: card };
  },
};

// Import mockScratchCards for citizen service
import { mockScratchCards } from "@/lib/mockData";
