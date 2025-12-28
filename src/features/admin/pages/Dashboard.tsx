import { useEffect } from "react";
import {
  Users,
  Zap,
  Gift,
  TrendingUp,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";
import { getRecentRedemptions } from "@/lib/mockData";

export default function AdminOverviewPage() {
  const { stats, isLoading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return <div>Failed to load stats</div>;
  }

  const recentRedemptions = getRecentRedemptions(3);

  const kpis = [
    {
      icon: Users,
      label: "Total Politicians",
      value: stats.totalPoliticians.toString(),
      change: "12%",
      trend: "up" as const,
    },
    {
      icon: Zap,
      label: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      change: "8%",
      trend: "up" as const,
    },
    {
      icon: CreditCard,
      label: "Cards in Circulation",
      value: stats.totalCardsCirculation.toLocaleString(),
      change: "5%",
      trend: "up" as const,
    },
    {
      icon: TrendingUp,
      label: "Total Redemptions",
      value: `₦${stats.totalRedemptionAmount.toLocaleString()}`,
      change: "23%",
      trend: "up" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's your platform summary.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Active Fraud Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.openFraudAlerts > 0 ? (
                <div className="text-center py-8">
                  <p className="text-2xl font-bold">{stats.openFraudAlerts}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Open fraud alerts require attention
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No active fraud alerts
                  </p>
                </div>
              )}
            </div>
            <Button variant="outline" className="mt-4 w-full" size="sm">
              <a href="/admin/fraud">View All Alerts</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Recent Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRedemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {redemption.citizen?.fullName || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(redemption.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ₦{redemption.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        redemption.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="mt-1 text-xs"
                    >
                      {redemption.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" size="sm">
              <a href="/admin/redemptions">View All</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
