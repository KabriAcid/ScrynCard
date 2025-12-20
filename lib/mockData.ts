import {
  Politician,
  Citizen,
  Order,
  ScratchCard,
  Redemption,
  FraudCheck,
  AdminStats,
  DenominationBreakdown,
} from "@/lib/mockTypes";

// Utility to generate IDs
const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

// Mock Politicians
export const mockPoliticians: Politician[] = [
  {
    id: generateId("POL"),
    fullName: "Babajide Sanwo-Olu",
    email: "sanwo-olu@example.com",
    phone: "+2348012345678",
    role: "politician",
    verified: true,
    createdAt: new Date(2024, 0, 15).toISOString(),
    party: "APC",
    position: "Governor",
    state: "Lagos",
    lga: "Ikeja",
    bvn: "12345678901",
    nin: "12345678901234",
  },
  {
    id: generateId("POL"),
    fullName: "Seyi Makinde",
    email: "makinde@example.com",
    phone: "+2348023456789",
    role: "politician",
    verified: true,
    createdAt: new Date(2024, 1, 20).toISOString(),
    party: "PDP",
    position: "Governor",
    state: "Oyo",
    lga: "Ibadan",
    bvn: "12345678902",
    nin: "12345678901235",
  },
  {
    id: generateId("POL"),
    fullName: "Kashim Shettima",
    email: "shettima@example.com",
    phone: "+2348034567890",
    role: "politician",
    verified: true,
    createdAt: new Date(2024, 2, 10).toISOString(),
    party: "APC",
    position: "Vice President",
    state: "Borno",
    lga: "Maiduguri",
    bvn: "12345678903",
    nin: "12345678901236",
  },
  {
    id: generateId("POL"),
    fullName: "Peter Obi",
    email: "obi@example.com",
    phone: "+2348045678901",
    role: "politician",
    verified: true,
    createdAt: new Date(2024, 3, 5).toISOString(),
    party: "LP",
    position: "Opposition Leader",
    state: "Anambra",
    lga: "Onitsha",
    bvn: "12345678904",
    nin: "12345678901237",
  },
  {
    id: generateId("POL"),
    fullName: "Atiku Abubakar",
    email: "atiku@example.com",
    phone: "+2348056789012",
    role: "politician",
    verified: true,
    createdAt: new Date(2024, 4, 12).toISOString(),
    party: "PDP",
    position: "Former VP",
    state: "Adamawa",
    lga: "Yola",
    bvn: "12345678905",
    nin: "12345678901238",
  },
];

// Mock Citizens
export const mockCitizens: Citizen[] = [
  {
    id: generateId("CIT"),
    fullName: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+2349011234567",
    role: "citizen",
    verified: true,
    createdAt: new Date(2024, 5, 1).toISOString(),
    bvn: "12345678906",
    kycStatus: "verified",
  },
  {
    id: generateId("CIT"),
    fullName: "Chioma Okafor",
    email: "chioma@example.com",
    phone: "+2349021234567",
    role: "citizen",
    verified: true,
    createdAt: new Date(2024, 5, 2).toISOString(),
    bvn: "12345678907",
    kycStatus: "verified",
  },
  {
    id: generateId("CIT"),
    fullName: "Emeka Eze",
    email: "emeka@example.com",
    phone: "+2349031234567",
    role: "citizen",
    verified: true,
    createdAt: new Date(2024, 5, 3).toISOString(),
    bvn: "12345678908",
    kycStatus: "verified",
  },
  {
    id: generateId("CIT"),
    fullName: "Fatima Ahmed",
    email: "fatima@example.com",
    phone: "+2349041234567",
    role: "citizen",
    verified: false,
    createdAt: new Date(2024, 5, 4).toISOString(),
    bvn: "12345678909",
    kycStatus: "pending",
  },
  {
    id: generateId("CIT"),
    fullName: "Kunle Adeyemi",
    email: "kunle@example.com",
    phone: "+2349051234567",
    role: "citizen",
    verified: true,
    createdAt: new Date(2024, 5, 5).toISOString(),
    bvn: "12345678910",
    kycStatus: "verified",
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: generateId("ORD"),
    politicianId: mockPoliticians[0].id,
    politician: mockPoliticians[0],
    batchId: "BATCH-APC-2024-001",
    totalCardValue: 50000000, // ₦50M
    serviceFee: 5000000, // 10%
    printingCost: 2130000,
    totalPaid: 57130000,
    status: "completed",
    cardCount: 10650,
    denominations: [
      { amount: 2000, quantity: 5000, subtotal: 10000000 },
      { amount: 5000, quantity: 3000, subtotal: 15000000 },
      { amount: 10000, quantity: 2000, subtotal: 20000000 },
      { amount: 50000, quantity: 500, subtotal: 25000000 },
    ],
    paymentReference: "PAY-2024-001",
    deliveredAt: new Date(2024, 1, 15).toISOString(),
    createdAt: new Date(2024, 1, 1).toISOString(),
    expiresAt: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: generateId("ORD"),
    politicianId: mockPoliticians[1].id,
    politician: mockPoliticians[1],
    batchId: "BATCH-PDP-2024-001",
    totalCardValue: 75000000,
    serviceFee: 7500000,
    printingCost: 3195000,
    totalPaid: 85695000,
    status: "processing",
    cardCount: 15975,
    denominations: [
      { amount: 2000, quantity: 7500, subtotal: 15000000 },
      { amount: 5000, quantity: 5000, subtotal: 25000000 },
      { amount: 10000, quantity: 3500, subtotal: 35000000 },
    ],
    paymentReference: "PAY-2024-002",
    createdAt: new Date(2024, 2, 10).toISOString(),
    expiresAt: new Date(2025, 1, 10).toISOString(),
  },
  {
    id: generateId("ORD"),
    politicianId: mockPoliticians[2].id,
    politician: mockPoliticians[2],
    batchId: "BATCH-APC-2024-002",
    totalCardValue: 100000000,
    serviceFee: 10000000,
    printingCost: 4260000,
    totalPaid: 114260000,
    status: "pending",
    cardCount: 21300,
    denominations: [
      { amount: 5000, quantity: 10000, subtotal: 50000000 },
      { amount: 10000, quantity: 5000, subtotal: 50000000 },
    ],
    createdAt: new Date(2024, 3, 5).toISOString(),
    expiresAt: new Date(2025, 2, 5).toISOString(),
  },
];

// Mock Scratch Cards
export const mockScratchCards: ScratchCard[] = [
  {
    id: generateId("CARD"),
    code: "APC-5K-B001-A3F7B9C2-X7",
    fullCode: "APC-5K-B001-A3F7B9C2-X7",
    denomination: 5000,
    status: "redeemed",
    orderId: mockOrders[0].id,
    redeemedBy: mockCitizens[0].id,
    redeemedAt: new Date(2024, 2, 20).toISOString(),
    createdAt: new Date(2024, 1, 15).toISOString(),
  },
  {
    id: generateId("CARD"),
    code: "APC-10K-B001-B4G8C0D3-Y8",
    fullCode: "APC-10K-B001-B4G8C0D3-Y8",
    denomination: 10000,
    status: "redeemed",
    orderId: mockOrders[0].id,
    redeemedBy: mockCitizens[1].id,
    redeemedAt: new Date(2024, 2, 21).toISOString(),
    createdAt: new Date(2024, 1, 15).toISOString(),
  },
  {
    id: generateId("CARD"),
    code: "APC-2K-B001-C5H9D1E4-Z9",
    fullCode: "APC-2K-B001-C5H9D1E4-Z9",
    denomination: 2000,
    status: "active",
    orderId: mockOrders[0].id,
    createdAt: new Date(2024, 1, 15).toISOString(),
  },
  {
    id: generateId("CARD"),
    code: "PDP-5K-B002-D6I0E2F5-A0",
    fullCode: "PDP-5K-B002-D6I0E2F5-A0",
    denomination: 5000,
    status: "active",
    orderId: mockOrders[1].id,
    createdAt: new Date(2024, 2, 10).toISOString(),
  },
  {
    id: generateId("CARD"),
    code: "PDP-10K-B002-E7J1F3G6-B1",
    fullCode: "PDP-10K-B002-E7J1F3G6-B1",
    denomination: 10000,
    status: "active",
    orderId: mockOrders[1].id,
    createdAt: new Date(2024, 2, 10).toISOString(),
  },
];

// Mock Redemptions
export const mockRedemptions: Redemption[] = [
  {
    id: generateId("RED"),
    cardId: mockScratchCards[0].id,
    card: mockScratchCards[0],
    citizenId: mockCitizens[0].id,
    citizen: mockCitizens[0],
    amount: 5000,
    bankName: "Zenith Bank",
    accountNumber: "1234567890",
    accountName: "AISHA BELLO",
    status: "completed",
    transferReference: "TRF-2024-001",
    fraudScore: 15,
    fraudFlags: [],
    completedAt: new Date(2024, 2, 20).toISOString(),
    createdAt: new Date(2024, 2, 20).toISOString(),
  },
  {
    id: generateId("RED"),
    cardId: mockScratchCards[1].id,
    card: mockScratchCards[1],
    citizenId: mockCitizens[1].id,
    citizen: mockCitizens[1],
    amount: 10000,
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "CHIOMA OKAFOR",
    status: "completed",
    transferReference: "TRF-2024-002",
    fraudScore: 22,
    fraudFlags: [],
    completedAt: new Date(2024, 2, 21).toISOString(),
    createdAt: new Date(2024, 2, 21).toISOString(),
  },
  {
    id: generateId("RED"),
    cardId: mockScratchCards[3].id,
    card: mockScratchCards[3],
    citizenId: mockCitizens[2].id,
    citizen: mockCitizens[2],
    amount: 5000,
    bankName: "Access Bank",
    accountNumber: "1111111111",
    accountName: "EMEKA EZE",
    status: "processing",
    fraudScore: 18,
    fraudFlags: [],
    createdAt: new Date(2024, 3, 10).toISOString(),
  },
];

// Mock Fraud Checks
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

// Admin Stats
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

// Utility: Get recent redemptions
export const getRecentRedemptions = (limit: number = 5): Redemption[] =>
  [...mockRedemptions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);

// Utility: Get recent orders
export const getRecentOrders = (limit: number = 5): Order[] =>
  [...mockOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
