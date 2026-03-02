import { z } from "zod";

export const RedemptionSchema = z.object({
  serialNumber: z
    .string()
    .min(9, "Serial number must be at least 9 characters")
    .max(9, "Serial number must be 9 characters")
    .regex(
      /^[A-Z0-9\-]+$/,
      "Serial number must contain only letters, numbers, and hyphens"
    ),

  cardCode: z
    .string()
    .min(18, "Card code must be at least 18 characters")
    .max(18, "Card code must be 18 characters")
    .regex(
      /^[A-Z0-9\-]+$/,
      "Card code must contain only letters, numbers, and hyphens"
    ),

  nin: z
    .string()
    .length(11, "NIN must be exactly 11 digits")
    .regex(/^\d{11}$/, "NIN must contain only numbers"),

  occupation: z.string().min(1, "Please select an occupation"),

  phoneNumber: z
    .string()
    .length(11, "Phone number must be exactly 11 digits")
    .regex(/^0[7-9][0-1]\d{8}$/, "Invalid Nigerian phone number format"),

  network: z.string().min(1, "Please select a network provider"),
});

export type RedemptionFormValues = z.infer<typeof RedemptionSchema>;

export const OCCUPATION_OPTIONS = [
  "Teacher",
  "Healthcare Worker",
  "Student",
  "Business Owner",
  "Civil Servant",
  "Artisan",
  "Farmer",
  "Driver",
  "Trader",
  "Others",
] as const;

export const NETWORK_OPTIONS = [
  "MTN",
  "Airtel",
  "Glo",
  "9Mobile",
  "Others",
] as const;

export const STEPS = [
  {
    id: 1,
    title: "Verify Card",
    description: "Enter serial number and card code",
  },
  {
    id: 2,
    title: "Biodata",
    description: "NIN and occupation details",
  },
  {
    id: 3,
    title: "Phone Number",
    description: "Verify your phone number",
  },
  {
    id: 4,
    title: "Confirm",
    description: "Review and confirm",
  },
];
