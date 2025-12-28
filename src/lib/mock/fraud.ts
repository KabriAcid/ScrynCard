import { FraudCheck } from "@/lib/mockTypes";
import { generateId } from "./utils";
import { mockRedemptions } from "./redemptions";

export const mockFraudChecks: FraudCheck[] = [
  {
    id: generateId("FRAUD"),
    redemptionId: mockRedemptions[0].id,
    riskScore: 15,
    riskLevel: "low",
    flags: [],
    decision: "approved",
    createdAt: new Date(2024, 2, 20).toISOString(),
  },
  {
    id: generateId("FRAUD"),
    redemptionId: mockRedemptions[1].id,
    riskScore: 45,
    riskLevel: "medium",
    flags: [
      {
        code: "VELOCITY_HIGH",
        description: "Multiple redemptions in short time",
        severity: "medium",
      },
    ],
    decision: "pending_review",
    createdAt: new Date(2024, 2, 21).toISOString(),
  },
];
