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

  phoneNumber: z
    .string()
    .min(11, "Phone number must be valid Nigerian format")
    .refine((phone) => {
      // Clean the phone number by removing hyphens before validation
      const cleanedPhone = phone.replace(/-/g, "");
      const result = NetworkDetector.detect(cleanedPhone);
      return result.isValid;
    }, "Invalid Nigerian phone number. Use 0XXXXXXXXXX format"),
});

export type RedemptionFormValues = z.infer<typeof RedemptionSchema>;

export const STEPS = [
  {
    id: 1,
    title: "Verify Card",
    description: "Enter serial number and card code",
  },
  {
    id: 2,
    title: "Phone Number",
    description: "Verify your phone number",
  },
  {
    id: 3,
    title: "Confirm",
    description: "Confirm redemption",
  },
];
