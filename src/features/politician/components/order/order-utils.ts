export const dataProducts = [
  { id: "data-5gb", label: "5GB", value: 5000, type: "data" as const, unit: "GB", minQuantity: 1 },
  { id: "data-10gb", label: "10GB", value: 10000, type: "data" as const, unit: "GB", minQuantity: 1 },
  { id: "data-20gb", label: "20GB", value: 20000, type: "data" as const, unit: "GB", minQuantity: 1 },
  { id: "data-50gb", label: "50GB", value: 50000, type: "data" as const, unit: "GB", minQuantity: 1 },
  { id: "data-100gb", label: "100GB", value: 100000, type: "data" as const, unit: "GB", minQuantity: 1 },
] as const;

export const airtimeProducts = [
  { id: "airtime-2k", label: "₦2,000", value: 2000, type: "airtime" as const, unit: "₦", minQuantity: 1 },
  { id: "airtime-5k", label: "₦5,000", value: 5000, type: "airtime" as const, unit: "₦", minQuantity: 1 },
  { id: "airtime-10k", label: "₦10,000", value: 10000, type: "airtime" as const, unit: "₦", minQuantity: 1 },
  { id: "airtime-20k", label: "₦20,000", value: 20000, type: "airtime" as const, unit: "₦", minQuantity: 1 },
  { id: "airtime-50k", label: "₦50,000", value: 50000, type: "airtime" as const, unit: "₦", minQuantity: 1 },
  { id: "airtime-100k", label: "₦100,000", value: 100000, type: "airtime" as const, unit: "₦", minQuantity: 1 },
] as const;

export const denominations = [...dataProducts, ...airtimeProducts];

export const SERVICE_FEE_RATE = 0.15; // 15%
export const PRINTING_COST_PER_CARD = 200; // ₦200 per unit
export const MINIMUM_ORDER_VALUE = 800000; // ₦800k minimum

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
