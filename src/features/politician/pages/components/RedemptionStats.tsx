import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CreditCard, Gift } from "lucide-react";

interface RedemptionStatsProps {
  totalRedemptions: number;
  successfulPayouts: number;
  totalWithVotersCard: number;
}

export function RedemptionStats({
  totalRedemptions,
  successfulPayouts,
  totalWithVotersCard,
}: RedemptionStatsProps) {
  const votersCardPercentage =
    totalRedemptions > 0
      ? Math.round((totalWithVotersCard / totalRedemptions) * 100)
      : 0;

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            With Voter's Card
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWithVotersCard}</div>
          <p className="text-xs text-muted-foreground">
            {votersCardPercentage}% of total redemptions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
