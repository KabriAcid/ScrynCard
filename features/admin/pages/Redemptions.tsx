"use client";

import { useEffect } from "react";
import { Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RedemptionsPage() {
  const { redemptions, isLoading, fetchRedemptions } = useAdminStore();

  useEffect(() => {
    fetchRedemptions();
  }, [fetchRedemptions]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Redemptions</h1>
        <p className="mt-2 text-muted-foreground">
          All platform redemptions across politicians
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Redemptions ({redemptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Citizen</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptions.map((redemption) => (
                <TableRow key={redemption.id}>
                  <TableCell>
                    {new Date(redemption.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{redemption.citizen?.fullName || "Unknown"}</TableCell>
                  <TableCell>₦{redemption.amount.toLocaleString()}</TableCell>
                  <TableCell>{redemption.bankName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        redemption.status === "completed"
                          ? "default"
                          : redemption.status === "processing"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {redemption.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RedemptionsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RedemptionsContent />
    </Suspense>
  );
}
