import { z } from "zod";
import { NetworkDetector } from "@/lib/operators";

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
    .min(11, "Phone number must be valid Nigerian format")
    .refine((phone) => {
      const result = NetworkDetector.detect(phone);
      return result.isValid;
    }, "Invalid Nigerian phone number. Use 0XXXXXXXXXX format"),
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
