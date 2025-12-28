import { Order } from "@/lib/mockTypes";
import { generateId } from "./utils";
import { mockPoliticians } from "./politicians";

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

export const getRecentOrders = (limit: number = 5): Order[] =>
  [...mockOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
