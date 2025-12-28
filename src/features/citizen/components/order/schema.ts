import { z } from "zod";
import { LucideIcon } from "lucide-react";

// ============================================================================
// DENOMINATIONS
// ============================================================================
export const denominations = [
  { id: "2000", label: "₦2k", value: 2000, minQty: 100 },
  { id: "5000", label: "₦5k", value: 5000, minQty: 1 },
  { id: "10000", label: "₦10k", value: 10000, minQty: 1 },
  { id: "20000", label: "₦20k", value: 20000, minQty: 1 },
  { id: "50000", label: "₦50k", value: 50000, minQty: 1 },
  { id: "100000", label: "₦100k", value: 100000, minQty: 1 },
  { id: "200000", label: "₦200k", value: 200000, minQty: 1 },
  { id: "500000", label: "₦500k", value: 500000, minQty: 1 },
  { id: "1000000", label: "₦1M", value: 1000000, minQty: 1 },
  { id: "2000000", label: "₦2M", value: 2000000, minQty: 1 },
  { id: "5000000", label: "₦5M", value: 5000000, minQty: 1 },
  { id: "10000000", label: "₦10M", value: 10000000, minQty: 1 },
] as const;

export type Denomination = (typeof denominations)[number];
export type DenominationType = Denomination["id"];

// ============================================================================
// ORDER CALCULATIONS
// ============================================================================
export const SERVICE_FEE_RATE = 0.15; // 15%
export const PRINTING_COST_PER_CARD = 200; // ₦200 per card

export interface OrderCalculations {
  totalCards: number;
  cardValue: number;
  serviceFee: number;
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
  const serviceFee = cardValue * SERVICE_FEE_RATE;
  const printingCost = totalCards * PRINTING_COST_PER_CARD;
  const totalToPay = cardValue + serviceFee + printingCost;

  return { totalCards, cardValue, serviceFee, printingCost, totalToPay };
};

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================
const denominationEnum = denominations.map((d) => d.id) as [
  string,
  ...string[]
];

export const OrderSchema = z.object({
  title: z.string({ required_error: "Please select a title." }),
  politicianName: z.string().min(3, "Name must be at least 3 characters."),
  politicalParty: z.string({
    required_error: "Please select a political party.",
  }),
  politicalRole: z.string({
    required_error: "Please select a political role.",
  }),
  photo: z.any().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^0[789][01]\d{8}$/, {
    message: "Please enter a valid Nigerian phone number.",
  }),
  state: z.string({ required_error: "Please select a state." }),
  lga: z.string({ required_error: "Please select an LGA." }),
  orderItems: z
    .array(
      z.object({
        denomination: z.enum(denominationEnum),
        quantity: z.coerce.number().min(1, "Min 1"),
      })
    )
    .min(1, "You must select at least one denomination and set a quantity.")
    .refine(
      (items) => {
        const totalQuantity = items.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        return totalQuantity >= 100;
      },
      {
        message: "Total quantity for the order must be at least 100 cards.",
        path: ["orderItems"],
      }
    )
    .refine(
      (items) => {
        const item2k = items.find((item) => item.denomination === "2000");
        return !item2k || item2k.quantity >= 100;
      },
      {
        message: "Quantity for ₦2k cards must be at least 100.",
        path: ["orderItems"],
      }
    ),
});

export type OrderFormValues = z.infer<typeof OrderSchema>;

// ============================================================================
// SELECT OPTIONS
// ============================================================================
export const politicalParties = [
  "APC",
  "PDP",
  "LP",
  "NNPP",
  "APGA",
  "SDP",
  "ADC",
  "YPP",
];
export const titles = [
  "Hon.",
  "Chief",
  "Dr.",
  "Engr.",
  "Barr.",
  "Alh.",
  "Hajiya",
  "Mr.",
  "Mrs.",
  "Ms.",
];
export const politicalRoles = [
  "President",
  "Vice President",
  "Governor",
  "Deputy Governor",
  "Senator",
  "House of Reps Member",
  "State Assembly Member",
  "Local Government Chairman",
  "Councillor",
  "Party Chairman",
  "Women Leader",
  "Youth Leader",
];

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
