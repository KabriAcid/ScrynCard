import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { UserProfile } from "@/lib/mock";

interface ActivityMetricsCardProps {
  userProfile: UserProfile;
}

export function ActivityMetricsCard({ userProfile }: ActivityMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Activity</CardTitle>
        <CardDescription>
          Your platform engagement and activity metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Average Order Value</p>
              <p className="text-xs text-muted-foreground">
                Per order card value
              </p>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(
                (userProfile.statistics?.totalCardValue || 0) /
                  (userProfile.statistics?.totalOrders || 1)
              )}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Redemption Rate</p>
              <p className="text-xs text-muted-foreground">
                Cards redeemed vs distributed
              </p>
            </div>
            <div className="text-2xl font-bold">
              {(
                ((userProfile.statistics?.totalRedemptions || 0) /
                  ((userProfile.statistics?.totalOrders || 1) * 1000)) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
