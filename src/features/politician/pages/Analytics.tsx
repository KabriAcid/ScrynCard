import { useEffect, useState } from "react";
import {
  RedemptionOverviewChart,
  GeographicDistributionChart,
  PartyAffiliationChart,
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
import { usePoliticianStore } from "@/stores/politicianStore";

export default function AnalyticsPage() {
  const { fetchOrderAnalytics } = usePoliticianStore();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [fetchOrderAnalytics]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Performing State
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Lagos</div>
            <p className="text-xs text-muted-foreground">4,000 redemptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Popular Party
            </CardTitle>
            <PartyPopper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">APC</div>
            <p className="text-xs text-muted-foreground">400 voters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Unique Voters
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,400</div>
            <p className="text-xs text-muted-foreground">+50 from yesterday</p>
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
            <div className="text-2xl font-bold">₦4,850</div>
            <p className="text-xs text-muted-foreground">
              Across all redemptions
            </p>
          </CardContent>
        </Card>
      </div>

      <PartyAffiliationChart />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <RedemptionOverviewChart />
        <GeographicDistributionChart />
      </div>
    </div>
  );
}
