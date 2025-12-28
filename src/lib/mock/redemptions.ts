import { Redemption } from "@/lib/mockTypes";
import { generateId } from "./utils";
import { mockScratchCards } from "./cards";
import { mockCitizens } from "./citizens";

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

export const getRecentRedemptions = (limit: number = 5): Redemption[] =>
  [...mockRedemptions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
