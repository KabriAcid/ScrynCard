import { useEffect, useState } from "react";
import type { Redemption } from "@/lib/types";
import { mockRedemptions } from "@/lib/mock";
import { usePoliticianStore } from "@/stores/politicianStore";
import { useAuthStore } from "@/stores/authStore";
import {
  AirtimeRedemptionStats,
  AirtimeRedemptionTable,
  RedemptionPageSkeleton,
} from "./components";

export default function RedemptionPage() {
  const { user } = useAuthStore();
  const { orders, isLoading, fetchOrders } = usePoliticianStore();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders(user.id);
    }
  }, [user?.id, fetchOrders]);

  useEffect(() => {
    // Transform mock redemptions to display format
    const transformedRedemptions: Redemption[] = mockRedemptions.map(
      (redemption) => ({
        id: redemption.id,
        date: new Date(redemption.createdAt).toLocaleDateString(),
        phoneNumber: redemption.phoneNumber || "Unknown",
        operator: redemption.mobileOperator || "Unknown",
        giftType: redemption.giftType || "airtime",
        amount: redemption.amount || 0,
        dataSize: redemption.dataSize || 0,
        status: redemption.status || "pending",
        giftCode: redemption.giftCode || "N/A",
      })
    );
    setRedemptions(transformedRedemptions);
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    return <RedemptionPageSkeleton />;
  }

  const totalRedemptions = redemptions.length;
  const totalAirtimeDistributed = redemptions
    .filter((r) => r.status === "completed" && r.giftType === "airtime")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  // Get top operator
  const operatorCounts: Record<string, number> = {};
  redemptions.forEach((r) => {
    operatorCounts[r.operator] = (operatorCounts[r.operator] || 0) + 1;
  });
  const topOperator =
    Object.entries(operatorCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "MTN";

  return (
    <div className="space-y-6">
      <AirtimeRedemptionStats
        totalRedemptions={totalRedemptions}
        totalAirtimeDistributed={totalAirtimeDistributed}
        topOperator={topOperator}
      />
      <AirtimeRedemptionTable redemptions={redemptions} />
    </div>
  );
}
