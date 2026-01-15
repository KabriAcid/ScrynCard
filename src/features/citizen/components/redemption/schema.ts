import { z } from "zod";
import { NetworkDetector } from "@/lib/operators";

const occupations = [
  "Student",
  "Healthcare Worker",
  "Teacher",
  "Business Owner",
  "Farmer",
  "Unemployed",
  "Other",
] as const;

export const RedemptionSchema = z.object({
  // Step 1: Biodata
  nin: z
    .string()
    .min(11, "NIN must be 11 digits")
    .max(11, "NIN must be 11 digits")
    .regex(/^\d{11}$/, "NIN must contain only digits"),

  occupation: z.enum(occupations, {
    errorMap: () => ({ message: "Please select a valid occupation" }),
  }),

  // Step 2: Card Verification
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

  // Step 3: Phone Verification
  phoneNumber: z
    .string()
    .min(11, "Phone number must be valid Nigerian format")
    .refine((phone) => {
      const result = NetworkDetector.detect(phone);
      return result.isValid;
    }, "Invalid Nigerian phone number. Use 0XXXXXXXXXX format"),
});

export type RedemptionFormValues = z.infer<typeof RedemptionSchema>;

export const STEPS = [
  {
    id: 1,
    title: "Personal Information",
    description: "Enter your NIN and occupation",
  },
  {
    id: 2,
    title: "Verify Card",
    description: "Enter serial number and card code",
  },
  {
    id: 3,
    title: "Phone Number",
    description: "Verify your phone number",
  },
  {
    id: 4,
    title: "Summary",
    description: "Review and confirm redemption",
  },
];
