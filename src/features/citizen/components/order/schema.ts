import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// ============================================================================
// PRODUCTS (DATA & AIRTIME)
// ============================================================================
export const dataProducts = [
  { id: "data-5gb", label: "5GB", value: 5000, type: "data" as const, unit: "GB", minQty: 1 },
  { id: "data-10gb", label: "10GB", value: 10000, type: "data" as const, unit: "GB", minQty: 1 },
  { id: "data-20gb", label: "20GB", value: 20000, type: "data" as const, unit: "GB", minQty: 1 },
  { id: "data-50gb", label: "50GB", value: 50000, type: "data" as const, unit: "GB", minQty: 1 },
  { id: "data-100gb", label: "100GB", value: 100000, type: "data" as const, unit: "GB", minQty: 1 },
] as const;

export const airtimeProducts = [
  { id: "airtime-2k", label: "₦2,000", value: 2000, type: "airtime" as const, unit: "₦", minQty: 1 },
  { id: "airtime-5k", label: "₦5,000", value: 5000, type: "airtime" as const, unit: "₦", minQty: 1 },
  { id: "airtime-10k", label: "₦10,000", value: 10000, type: "airtime" as const, unit: "₦", minQty: 1 },
  { id: "airtime-20k", label: "₦20,000", value: 20000, type: "airtime" as const, unit: "₦", minQty: 1 },
  { id: "airtime-50k", label: "₦50,000", value: 50000, type: "airtime" as const, unit: "₦", minQty: 1 },
  { id: "airtime-100k", label: "₦100,000", value: 100000, type: "airtime" as const, unit: "₦", minQty: 1 },
] as const;

export const denominations = [...dataProducts, ...airtimeProducts] as const;

export function getDenominationLabel(product: (typeof denominations)[number]) {
  return product.type === "airtime" ? formatCurrency(product.value) : product.label;
}

// ============================================================================
// ORDER CALCULATIONS
// ============================================================================
export const PRINTING_COST_PER_CARD = 200; // ₦200 per unit
export const MINIMUM_ORDER_VALUE = 50000; // Minimum card subtotal

interface OrderCalculations {
  totalCards: number;
  cardValue: number;
  printingCost: number;
  totalToPay: number;
}

export const calculateOrderTotals = (
  items: { denomination: string; quantity: number }[]
): OrderCalculations => {
  const totalCards = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
  const cardValue = items.reduce((sum, item) => {
    const denom = denominations.find((d) => d.id === item.denomination);
    return sum + (denom?.value || 0) * (Number(item.quantity) || 0);
  }, 0);
  const printingCost = totalCards * PRINTING_COST_PER_CARD;
  const totalToPay = cardValue + printingCost;

  return { totalCards, cardValue, printingCost, totalToPay };
};

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================
const denominationEnum = denominations.map((d) => d.id) as [
  string,
  ...string[]
];

export const OrderSchema = z.object({
  purpose: z.enum(["business", "marriage"]),
  businessName: z.string().min(2, "Enter your business name."),
  businessType: z.string().min(2, "Enter your business type."),
  fullName: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Enter a valid email address."),
  state: z.string({ required_error: "Please select a state." }),
  lga: z.string({ required_error: "Please select an LGA." }),
  orderItems: z
    .array(
      z.object({
        denomination: z.enum(denominationEnum),
        quantity: z.coerce.number().min(10, "Minimum quantity is 10.").multipleOf(10, "Use increments of 10."),
      })
    )
    .min(1, "Please select at least one product.")
    .refine(
      (items) => {
        const totalValue = items.reduce((sum, item) => {
          const denom = denominations.find((d) => d.id === item.denomination);
          return sum + (denom?.value || 0) * item.quantity;
        }, 0);
        return totalValue >= MINIMUM_ORDER_VALUE;
      },
      {
        message: `Minimum order value is ₦${(MINIMUM_ORDER_VALUE / 1000).toLocaleString()}k`,
        path: ["orderItems"],
      }
    ),
});

export type OrderFormValues = z.infer<typeof OrderSchema>;

// ============================================================================
// SELECT OPTIONS
// ============================================================================

// ============================================================================
// STATES AND LGAs (Katsina first, then alphabetical)
// ============================================================================
export const statesAndLgas: Record<string, string[]> = {
  Katsina: [
    "Katsina",
    "Daura",
    "Funtua",
    "Malumfashi",
    "Kankara",
    "Jibia",
    "Kafur",
    "Dutsin-Ma",
    "Mani",
    "Bakori",
    "Batsari",
    "Baure",
    "Bindawa",
    "Charanchi",
    "Dan-Musa",
    "Dandume",
    "Danja",
    "Ingawa",
    "Kaita",
    "Kurfi",
    "Kusada",
    "Mai'adua",
    "Mashi",
    "Matazu",
    "Musawa",
    "Rimi",
    "Sabuwa",
    "Safana",
    "Sandamu",
    "Zango",
  ],
  "Abuja (FCT)": [
    "Abuja Municipal (AMAC)",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Abaji",
  ],
  Kaduna: [
    "Kaduna North",
    "Kaduna South",
    "Chikun",
    "Igabi",
    "Zaria",
    "Sabon Gari",
    "Giwa",
    "Soba",
  ],
  Kano: [
    "Kano Municipal",
    "Fagge",
    "Dala",
    "Gwale",
    "Tarauni",
    "Nassarawa",
    "Ungogo",
    "Kumbotso",
  ],
  Lagos: [
    "Ikeja",
    "Lagos Island",
    "Lagos Mainland",
    "Eti-Osa",
    "Surulere",
    "Kosofe",
    "Agege",
    "Alimosho",
  ],
  Oyo: [
    "Ibadan North",
    "Ibadan South-West",
    "Ibadan North-West",
    "Ibadan North-East",
    "Ibadan South-East",
    "Ogbomosho North",
    "Oyo East",
  ],
  Rivers: [
    "Port Harcourt",
    "Obio-Akpor",
    "Eleme",
    "Ikwerre",
    "Oyigbo",
    "Okrika",
    "Bonny",
  ],
};

export const stateNames = Object.keys(statesAndLgas);

// ============================================================================
// STEP CONFIGURATION
// ============================================================================
export interface StepConfig {
  id: number;
  title: string;
  description: string;
  fields: readonly (keyof OrderFormValues)[];
  icon: LucideIcon;
}
