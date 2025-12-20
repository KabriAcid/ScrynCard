import { z } from "zod";

export const RedemptionSchema = z.object({
  serialNumber: z.string().length(9, "Serial number must be XX-XXXXXX format"),
  cardCode: z.string().length(18, "Card code must be 15 characters"),
  accountName: z.string().min(3, "Please enter account name"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^0[789][01]\d{8}$/, "Please enter a valid Nigerian phone number")
    .max(11),
  nin: z
    .string()
    .regex(/^\d{11}$/, "NIN must be 11 digits")
    .max(11),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  state: z.string().min(1, "Please select a state"),
  lga: z.string().min(1, "Please select an LGA"),
  ward: z.string().min(1, "Please select a ward"),
  favoriteParty: z.string().min(1, "Please select your favorite party"),
  hasVotersCard: z.boolean().default(false),
  bankName: z.string().min(2, "Please select a bank"),
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, "Account number must be 10 digits"),
  bvn: z
    .string()
    .regex(/^\d{11}$/, "BVN must be 11 digits")
    .max(11),
});

export type RedemptionFormValues = z.infer<typeof RedemptionSchema>;

export const STEPS = [
  {
    id: 1,
    title: "Personal Details",
    description: "Enter your personal information",
  },
  {
    id: 2,
    title: "Location",
    description: "Select your location details",
  },
  {
    id: 3,
    title: "Favorite Party",
    description: "Select your political preference",
  },
  {
    id: 4,
    title: "Bank Details",
    description: "Enter your bank account information",
  },
];

export const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank",
  "Ecobank Nigeria",
  "Fidelity Bank Nigeria",
  "First Bank of Nigeria",
  "First City Monument Bank",
  "Guaranty Trust Bank",
  "Jaiz Bank",
  "Keystone Bank Limited",
  "Polaris Bank",
  "Stanbic IBTC Bank Nigeria",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank Nigeria",
  "TAJBank",
  "Union Bank of Nigeria",
  "United Bank for Africa",
  "Unity Bank Plc",
  "Wema Bank",
  "Zenith Bank",
];

export const POLITICAL_PARTIES = [
  {
    name: "APC",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/3b/All_Progressives_Congress_logo.png",
  },
  {
    name: "PDP",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Peoples_Democratic_Party_logo.png/220px-Peoples_Democratic_Party_logo.png",
  },
  {
    name: "LP",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Labour_Party_of_Nigeria_logo.png/220px-Labour_Party_of_Nigeria_logo.png",
  },
  {
    name: "NNPP",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/New_Nigeria_Peoples_Party_logo.png/220px-New_Nigeria_Peoples_Party_logo.png",
  },
  {
    name: "APGA",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/All_Progressives_Grand_Alliance_logo.png/220px-All_Progressives_Grand_Alliance_logo.png",
  },
];

export const STATES_AND_LGAS: Record<string, string[]> = {
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

export const WARDS_BY_LGA: Record<string, string[]> = {
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
