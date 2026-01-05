import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Zap, TrendingUp } from "lucide-react";

interface AirtimeRedemptionStatsProps {
  totalRedemptions: number;
  totalAirtimeDistributed: number;
  topOperator: string;
}

export function AirtimeRedemptionStats({
  totalRedemptions,
  totalAirtimeDistributed,
  topOperator,
}: AirtimeRedemptionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Redemptions
          </CardTitle>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRedemptions}{" "}
            <span className="text-base text-muted-foreground">/ 10,000</span>
          </div>
          <p className="text-xs text-muted-foreground">+12% from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Airtime Distributed
          </CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{totalAirtimeDistributed.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">98% success rate</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Operator</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topOperator}</div>
          <p className="text-xs text-muted-foreground">Most redeemed network</p>
        </CardContent>
      </Card>
    </div>
  );
}
