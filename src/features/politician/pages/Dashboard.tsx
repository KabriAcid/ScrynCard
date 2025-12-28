import { useEffect } from "react";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { usePoliticianStore } from "@/stores/politicianStore";
import { useAuthStore } from "@/stores/authStore";
import {
  DashboardHeader,
  KPICards,
  PartyAffiliationSection,
  RedemptionOverviewSection,
  RecentOrdersSection,
} from "./components";

export default function PoliticianDashboardPage() {
  const { user } = useAuthStore();
  const { stats, isLoading, fetchDashboard } = usePoliticianStore();

  useEffect(() => {
    if (user?.id) {
      fetchDashboard(user.id);
    }
  }, [user?.id, fetchDashboard]);

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  const politician = stats?.politician;
  const recentOrders = stats?.recentOrders || [];
  const dashboardStats = stats?.stats || {};

  return (
    <div className="space-y-6">
      <DashboardHeader politicianName={politician?.fullName} />

      <KPICards stats={dashboardStats} />

      {/* Party Affiliation - Full Width */}
      <PartyAffiliationSection />

      {/* Redemption Overview */}
      <RedemptionOverviewSection />

      {/* Recent Orders */}
      <RecentOrdersSection orders={recentOrders} />
    </div>
  );
}

