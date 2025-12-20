import { Suspense } from "react";
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
import { simulateDelay } from "@/lib/dev-utils";
import prisma from "@/lib/prisma";

async function getAnalyticsData() {
  await simulateDelay(800);

  const [totalRedemptions, totalAmount, activePoliticians, totalCitizens] =
    await Promise.all([
      prisma.redemption.count(),
      prisma.redemption.aggregate({
        _sum: { amount: true },
      }),
      prisma.politician.count({
        where: {
          orders: {
            some: {},
          },
        },
      }),
      prisma.citizen.count(),
    ]);

  return {
    totalRedemptions,
    totalAmount: totalAmount._sum.amount || 0,
    activePoliticians,
    totalCitizens,
  };
}

async function AnalyticsContent() {
  const stats = await getAnalyticsData();

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
      value: `₦${stats.totalAmount.toLocaleString()}`,
      change: "23%",
      trend: "up" as const,
    },
    {
      icon: Users,
      label: "Active Politicians",
      value: stats.activePoliticians.toString(),
      change: "8%",
      trend: "up" as const,
    },
    {
      icon: Activity,
      label: "Total Citizens",
      value: stats.totalCitizens.toLocaleString(),
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

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  );
}
