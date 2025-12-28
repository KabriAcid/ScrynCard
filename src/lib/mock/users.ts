import { Politician } from "@/lib/mockTypes";
import { mockPoliticians } from "./politicians";

export interface UserProfile extends Politician {
  avatar?: string;
  bio?: string;
  statistics?: {
    totalOrders: number;
    totalCardValue: number;
    totalRedemptions: number;
  };
}

export function getUserProfileByEmail(email: string): UserProfile | null {
  const politician = mockPoliticians.find((p) => p.email === email);
  if (!politician) return null;

  return enrichPoliticianProfile(politician);
}

export function getDemoUserProfile(): UserProfile {
  const demoPolitician = mockPoliticians[0];
  return enrichPoliticianProfile(demoPolitician);
}

function enrichPoliticianProfile(politician: Politician): UserProfile {
  return {
    ...politician,
    avatar: `/img/dikko-radda.png`,
    bio: "Dedicated public servant committed to development and innovation",
    statistics: {
      totalOrders: Math.floor(Math.random() * 50) + 10,
      totalCardValue: Math.floor(Math.random() * 5000000) + 500000,
      totalRedemptions: Math.floor(Math.random() * 1000) + 100,
    },
  };
}
