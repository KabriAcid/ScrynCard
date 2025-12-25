import { z } from "zod";
import { LucideIcon } from "lucide-react";

export const denominations = [
  { id: "2000", label: "₦2k" },
  { id: "5000", label: "₦5k" },
  { id: "10000", label: "₦10k" },
  { id: "20000", label: "₦20k" },
  { id: "50000", label: "₦50k" },
  { id: "100000", label: "₦100k" },
  { id: "200000", label: "₦200k" },
  { id: "500000", label: "₦500k" },
  { id: "1000000", label: "₦1M" },
  { id: "2000000", label: "₦2M" },
  { id: "5000000", label: "₦5M" },
  { id: "10000000", label: "₦10M" },
] as const;

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
  ward: z.string({ required_error: "Please select a ward." }),
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

export const politicalParties = ["ACN", "PDP", "APC", "LP", "NNPP", "APGA"];
export const titles = ["Hon.", "Chief", "Dr.", "Mr.", "Mrs.", "Ms."];
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
];

export const statesAndLgas: Record<string, string[]> = {
  "Abuja (FCT)": ["Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  Lagos: ["Agege", "Ikeja", "Kosofe", "Mushin", "Oshodi-Isolo"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre", "Oyigbo"],
  Kano: ["Kano Municipal", "Fagge", "Dala", "Gwale", "Tarauni"],
  Oyo: [
    "Ibadan North",
    "Ibadan South-West",
    "Ibadan North-West",
    "Ibadan North-East",
    "Ibadan South-East",
  ],
};

export const stateNames = Object.keys(statesAndLgas);

export const wardsByLga: Record<string, string[]> = {
  "Abuja Municipal": [
    "City Centre",
    "Garki",
    "Wuse",
    "Maitama",
    "Asokoro",
    "Guzape",
  ],
  Bwari: ["Bwari Central", "Dutse", "Kubwa", "Ushafa", "Byazhin"],
  Ikeja: ["Alausa", "Oregun", "Ojodu", "Agidingbi", "GRA", "Opebi"],
  "Port Harcourt": ["Old GRA", "New GRA", "D-Line", "Diobu", "Borokiri"],
  "Kano Municipal": ["Sabo Gari", "Nassarawa", "Tarauni", "Fagge", "Gwale"],
  "Ibadan North": ["Agodi", "Bodija", "Sango", "UI", "Mokola"],
};

export interface StepConfig {
  id: number;
  title: string;
  fields: readonly (keyof OrderFormValues)[];
  icon: LucideIcon;
}
