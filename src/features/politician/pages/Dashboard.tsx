import { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAuthStore } from "@/stores/authStore";
import { getRecentOrders, getRecentRedemptions } from "@/lib/mock";
import { BeneficiaryDistributionChart } from "@/components/dashboard/analytics-charts";
import {
  DashboardHeader,
  KPICards,
  RedemptionOverviewSection,
  RecentOrdersSection,
} from "./components";

interface Order {
  id: string;
  batchId: string;
  totalCardValue: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

export default function PoliticianDashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    // Simulate loading mock data
    const timer = setTimeout(() => {
      setRecentOrders(getRecentOrders(5));
      setDashboardStats({
        totalOrders: 12,
        totalRedemptions: 2458,
        totalAirtimeDistributed: 18550000,
        uniqueVoters: 1400,
        completionRate: 85,
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!dashboardStats || (isLoading && !dashboardStats)) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader politicianName={user?.fullName || "User"} />

      <KPICards stats={dashboardStats} />

      {/* Beneficiary Distribution */}
      <BeneficiaryDistributionChart />

      {/* Redemption Overview */}
      <RedemptionOverviewSection />

      {/* Recent Orders */}
      <RecentOrdersSection orders={recentOrders} />
    </div>
  );
}
