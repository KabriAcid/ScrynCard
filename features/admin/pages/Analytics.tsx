"use client";

import { useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";
import {
  PartyAffiliationChart,
  RedemptionOverviewChart,
} from "@/components/dashboard/analytics-charts";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";

export default function AnalyticsPage() {
  const { stats, isLoading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return <div>Failed to load analytics</div>;
  }

  const kpis = [
    {
      icon: TrendingUp,
      label: "Total Redemptions",
      value: stats.totalRedemptions.toLocaleString(),
      change: "15%",
      trend: "up" as const,
    },
    {
      icon: DollarSign,
      label: "Total Value",
      value: `₦${stats.totalRedemptionAmount.toLocaleString()}`,
      change: "23%",
      trend: "up" as const,
    },
    {
      icon: Users,
      label: "Active Politicians",
      value: stats.totalPoliticians.toString(),
      change: "8%",
      trend: "up" as const,
    },
    {
      icon: Activity,
      label: "Cards Circulating",
      value: stats.totalCardsCirculation.toLocaleString(),
      change: "12%",
      trend: "up" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Comprehensive analytics across the platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RedemptionOverviewChart />
        <PartyAffiliationChart />
      </div>
    </div>
  );
}
