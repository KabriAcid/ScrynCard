import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Gift, TrendingUp, XCircle } from "lucide-react";
import type { Redemption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { TableSkeleton } from "@/components/dashboard/skeletons";
import { usePoliticianStore } from "@/stores/politicianStore";

export default function RedemptionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const { fetchOrders } = usePoliticianStore();

  useEffect(() => {
    const loadRedemptions = async () => {
      try {
        setLoading(true);
        const orders = await fetchOrders();
        // Transform orders to redemption format for display
        const transformedRedemptions: Redemption[] = orders.map(
          (order: any, index: number) => ({
            id: order.id,
            date: new Date(order.createdAt).toISOString().split("T")[0],
            amount: order.amount,
            status: "Completed",
            citizenName: `Citizen ${index + 1}`,
            cardCode: `****-${Math.random().toString().slice(2, 6)}`,
            bank: "Zenith Bank",
          })
        );
        setRedemptions(transformedRedemptions);
      } catch (error) {
        console.error("Failed to load redemptions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRedemptions();
  }, [fetchOrders]);

  if (loading) {
    return <TableSkeleton numRows={5} numCells={8} />;
  }

  const totalRedemptions = redemptions.length;
  const successfulPayouts = redemptions
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="grid gap-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Redemption History</CardTitle>
          <CardDescription>
            An overview of all card redemptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">S/N</TableHead>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">
                  Citizen Name
                </TableHead>
                <TableHead className="whitespace-nowrap">Amount</TableHead>
                <TableHead className="whitespace-nowrap">Card Code</TableHead>
                <TableHead className="whitespace-nowrap">Bank</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptions.map((redemption, index) => (
                <TableRow key={redemption.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {redemption.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {redemption.citizenName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    ₦{redemption.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {redemption.cardCode}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {redemption.bank}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant={
                        redemption.status === "Completed"
                          ? "default"
                          : redemption.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={cn("capitalize", {
                        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300":
                          redemption.status === "Completed",
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300":
                          redemption.status === "Pending",
                        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300":
                          redemption.status === "Failed",
                      })}
                    >
                      {redemption.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/politician/redemption/${redemption.id}`)
                      }
                    >
                      View Details
                    </Button>
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
