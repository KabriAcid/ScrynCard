// Re-export all mock data from centralized index
export { mockPoliticians } from "./politicians";
export { mockCitizens } from "./citizens";
export { mockOrders, getRecentOrders } from "./orders";
export { mockScratchCards } from "./cards";
export { mockRedemptions, getRecentRedemptions } from "./redemptions";
export { mockFraudChecks } from "./fraud";
export { generateAdminStats } from "./stats";
export {
  getUserProfileByEmail,
  getDemoUserProfile,
  type UserProfile,
} from "./users";
