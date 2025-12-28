import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CreditCard, TrendingUp, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import type { UserProfile } from "@/lib/mock";

interface StatisticsCardsProps {
  userProfile: UserProfile;
}

export function StatisticsCards({ userProfile }: StatisticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userProfile.statistics?.totalOrders || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            All-time orders placed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Card Value</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(userProfile.statistics?.totalCardValue || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total value distributed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Redemptions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userProfile.statistics?.totalRedemptions.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Cards redeemed by citizens
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Member Since</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {format(new Date(userProfile.createdAt), "MMM yyyy")}
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.floor(
              (Date.now() - new Date(userProfile.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days active
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
