import { useEffect, useState } from "react";
import {
  RedemptionOverviewChart,
  OperatorDistributionChart,
} from "@/components/dashboard/analytics-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, MapPin, PartyPopper, Wallet } from "lucide-react";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { mockRedemptions, getRecentRedemptions } from "@/lib/mock";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      const recentRedemptions = getRecentRedemptions(10);

      // Calculate analytics from redemptions
      const operatorCounts: Record<string, number> = {};
      let totalRedemptions = 0;
      let totalValue = 0;

      recentRedemptions.forEach((r) => {
        operatorCounts[r.mobileOperator] =
          (operatorCounts[r.mobileOperator] || 0) + 1;
        totalRedemptions++;
        totalValue += r.amount;
      });

      const topOperator = Object.entries(operatorCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] || "MTN";

      setAnalyticsData({
        topOperator,
        topOperatorCount:
          operatorCounts[topOperator] || 0,
        totalRedemptions,
        avgValue: totalValue / totalRedemptions,
        uniqueUsers: Math.floor(totalRedemptions * 1.2),
      });
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !analyticsData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Operator
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.topOperator}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.topOperatorCount} redemptions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redemptions
            </CardTitle>
            <PartyPopper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalRedemptions}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Redemption Value
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{Math.round(analyticsData.avgValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Per redemption
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <RedemptionOverviewChart />
        <OperatorDistributionChart />
      </div>
    </div>
  );
}
