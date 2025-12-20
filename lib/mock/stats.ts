import { AdminStats } from "@/lib/mockTypes";
import { mockPoliticians } from "./politicians";
import { mockOrders } from "./orders";
import { mockScratchCards } from "./cards";
import { mockRedemptions } from "./redemptions";
import { mockFraudChecks } from "./fraud";

export const generateAdminStats = (): AdminStats => ({
  totalPoliticians: mockPoliticians.length,
  activeCampaigns: mockOrders.filter((o) => o.status === "processing").length,
  totalCardsCirculation: mockScratchCards.filter((c) => c.status === "active")
    .length,
  totalRedemptions: mockRedemptions.length,
  totalRedemptionAmount: mockRedemptions.reduce((sum, r) => sum + r.amount, 0),
  openFraudAlerts: mockFraudChecks.filter(
    (f) => f.decision === "pending_review"
  ).length,
  successRate: 98.5,
});
