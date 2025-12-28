export const denominations = [
  { id: "2000", label: "₦2k", value: 2000 },
  { id: "5000", label: "₦5k", value: 5000 },
  { id: "10000", label: "₦10k", value: 10000 },
  { id: "20000", label: "₦20k", value: 20000 },
  { id: "50000", label: "₦50k", value: 50000 },
  { id: "100000", label: "₦100k", value: 100000 },
  { id: "200000", label: "₦200k", value: 200000 },
  { id: "500000", label: "₦500k", value: 500000 },
  { id: "1000000", label: "₦1M", value: 1000000 },
  { id: "2000000", label: "₦2M", value: 2000000 },
  { id: "5000000", label: "₦5M", value: 5000000 },
  { id: "10000000", label: "₦10M", value: 10000000 },
] as const;

export const SERVICE_FEE_RATE = 0.15; // 15%
export const PRINTING_COST_PER_CARD = 200; // ₦200 per card

export type Denomination = (typeof denominations)[number];

export interface OrderItem {
  denomination: string;
  quantity: number;
}

export interface OrderCalculations {
  totalCards: number;
  cardValue: number;
  serviceFee: number;
  printingCost: number;
  totalToPay: number;
}

export const calculateOrderTotals = (items: OrderItem[]): OrderCalculations => {
  const totalCards = items.reduce((sum, item) => sum + item.quantity, 0);
  const cardValue = items.reduce((sum, item) => {
    const denom = denominations.find((d) => d.id === item.denomination);
    return sum + (denom?.value || 0) * item.quantity;
  }, 0);
  const serviceFee = cardValue * SERVICE_FEE_RATE;
  const printingCost = totalCards * PRINTING_COST_PER_CARD;
  const totalToPay = cardValue + serviceFee + printingCost;

  return {
    totalCards,
    cardValue,
    serviceFee,
    printingCost,
    totalToPay,
  };
};
