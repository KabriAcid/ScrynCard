import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Gift } from "lucide-react";

interface RedemptionStatsProps {
  totalRedemptions: number;
  successfulPayouts: number;
}

export function RedemptionStats({
  totalRedemptions,
  successfulPayouts,
}: RedemptionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Redemptions
          </CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
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
            Successful Payouts
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{successfulPayouts.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">95% success rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
