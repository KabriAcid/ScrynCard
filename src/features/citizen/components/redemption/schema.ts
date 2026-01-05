import { z } from "zod";
import { NetworkDetector } from "@/lib/operators";

export const RedemptionSchema = z.object({
  giftCode: z.string().min(5, "Gift code is required").toUpperCase(),

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
    title: "Verify Gift",
    description: "Enter your gift code",
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
