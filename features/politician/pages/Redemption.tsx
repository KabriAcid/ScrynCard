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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadRedemptions = async () => {
      if (user?.id) {
        await fetchOrders(user.id);
        setMounted(true);
      }
    };

    loadRedemptions();
  }, [user?.id]);

  useEffect(() => {
    // Transform orders to redemption format for display
    if (orders.length > 0) {
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
    }
  }, [orders]);

  if (!mounted || isLoading) {
    return <RedemptionPageSkeleton />;
  }

  const totalRedemptions = redemptions.length;
  const successfulPayouts = redemptions
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="grid gap-6">
      <RedemptionStats
        totalRedemptions={totalRedemptions}
        successfulPayouts={successfulPayouts}
      />
      <RedemptionTable redemptions={redemptions} />
    </div>
  );
}
