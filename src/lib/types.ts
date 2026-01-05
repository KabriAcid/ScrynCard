import type { LucideIcon } from "lucide-react";
import type { MobileOperator } from "./operators/types";

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  giftCode: string;
  phoneNumber: string;
  operator: MobileOperator;
};

export type Order = {
  id: string;
  date: string;
  denomination: number;
  quantity: number;
  status: "Completed" | "Processing" | "Pending";
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
};

export type Redemption = {
  id: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  giftCode: string;
  phoneNumber: string;
  operator: MobileOperator;
  giftType: "airtime" | "data";
};

export type Redeemer = {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  operatorDetails: {
    phoneNumber: string;
    operator: MobileOperator;
  };
  location: {
    ipAddress: string;
    redemptionDate: string;
  };
};
