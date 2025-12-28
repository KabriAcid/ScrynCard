import { useEffect, useState } from "react";
import type { Redemption } from "@/lib/types";
import { usePoliticianStore } from "@/stores/politicianStore";
import { useAuthStore } from "@/stores/authStore";
import {
  RedemptionStats,
  RedemptionTable,
  RedemptionPageSkeleton,
} from "./components";

export default function RedemptionPage() {
  const { user } = useAuthStore();
  const { orders, isLoading, fetchOrders } = usePoliticianStore();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadRedemptions = async () => {
      if (user?.id) {
        await fetchOrders(user.id);
        setHasLoaded(true);
      }
    };

    loadRedemptions();
  }, [user?.id, fetchOrders]);

  useEffect(() => {
    // Transform orders to redemption format for display
    const transformedRedemptions: Redemption[] = orders.map(
      (order: any, index: number) => ({
        id: order.id,
        date: new Date(order.createdAt).toLocaleDateString(),
        amount: order.totalCardValue || 0,
        status: "Completed",
        citizenName: `Citizen ${index + 1}`,
        cardCode: `****-${Math.random().toString().slice(2, 6)}`,
        bank: "Zenith Bank",
      })
    );
    setRedemptions(transformedRedemptions);
  }, [orders]);

  // Show skeleton while loading OR if data hasn't loaded yet (matching Dashboard pattern)
  if (isLoading || !hasLoaded) {
    return <RedemptionPageSkeleton />;
  }

  const totalRedemptions = redemptions.length;
  const successfulPayouts = redemptions
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <RedemptionStats
        totalRedemptions={totalRedemptions}
        successfulPayouts={successfulPayouts}
      />
      <RedemptionTable redemptions={redemptions} />
    </div>
  );
}
