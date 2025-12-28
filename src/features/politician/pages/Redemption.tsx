import { useEffect, useState } from "react";
import type { Redemption } from "@/lib/types";
import { mockRedemptions } from "@/lib/mock";
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
        amount: redemption.amount,
        status:
          redemption.status === "completed"
            ? "Completed"
            : redemption.status === "processing"
              ? "Processing"
              : "Pending",
        citizenName: redemption.citizen?.fullName || "Unknown",
        cardCode: redemption.card?.code || "N/A",
        bank: redemption.bankName || "N/A",
      })
    );
    setRedemptions(transformedRedemptions);
  }, []);

  // Show skeleton while loading
  if (isLoading) {
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
