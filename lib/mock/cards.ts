import { ScratchCard } from "@/lib/mockTypes";
import { generateId } from "./utils";
import { mockOrders } from "./orders";
import { mockCitizens } from "./citizens";

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
