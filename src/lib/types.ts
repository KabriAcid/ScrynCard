import type { LucideIcon } from "lucide-react";

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  cardCode: string;
  account: string;
  bank: string;
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
  cardCode: string;
  citizenName: string;
  bank: string;
  dob?: string;
  favoriteParty?: string;
  hasVotersCard?: boolean;
};

export type Redeemer = {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    nin: string;
    dob?: string;
    favoriteParty?: string;
    hasVotersCard?: boolean;
  };
  bankDetails: {
    accountNumber: string;
    bankName: string;
    bvn: string;
  };
  location: {
    state: string;
    lga: string;
    ipAddress: string;
    redemptionDate: string;
  };
};
