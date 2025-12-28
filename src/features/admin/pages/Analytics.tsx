import { useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Gift,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/admin/kpi-card";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";
import {
  RedemptionsTab,
  CitizensTab,
  PoliticiansTab,
  CardsTab,
} from "../components/analytics";

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

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Tabbed Analytics Sections */}
      <Tabs defaultValue="redemptions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
          <TabsTrigger
            value="redemptions"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Redemptions</span>
            <span className="sm:hidden">Redeem</span>
          </TabsTrigger>
          <TabsTrigger
            value="citizens"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Citizens</span>
            <span className="sm:hidden">Citizens</span>
          </TabsTrigger>
          <TabsTrigger
            value="politicians"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Politicians</span>
            <span className="sm:hidden">Politicians</span>
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
            <span className="sm:hidden">Cards</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="redemptions" className="mt-6">
          <RedemptionsTab />
        </TabsContent>

        <TabsContent value="citizens" className="mt-6">
          <CitizensTab />
        </TabsContent>

        <TabsContent value="politicians" className="mt-6">
          <PoliticiansTab />
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <CardsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
