import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  DollarSign,
  CreditCard,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import type { Order } from "@/lib/mockTypes";
import { mockOrders, getRecentOrders } from "@/lib/mock";

const statusIcons = {
  completed: CheckCircle2,
  pending: Clock,
  processing: Loader2,
  cancelled: XCircle,
};

const statusColors = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, isLoading } = usePoliticianStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // In a real app, this would fetch orders from an API
    // For now, we'll use mock data
    if (stats?.recentOrders) {
      setOrders(stats.recentOrders);
    }
  }, [stats]);

  const calculateTotals = () => {
    const totalOrders = orders.length;
    const totalCardValue = orders.reduce(
      (sum, order) => sum + order.totalCardValue,
      0
    );
    const serviceFeeRate = 0.15; // 15%
    const totalServiceFees = orders.reduce(
      (sum, order) => sum + order.serviceFee,
      0
    );
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPaid,
      0
    );
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;

    return {
      totalOrders,
      totalCardValue,
      totalServiceFees,
      totalRevenue,
      completedOrders,
      serviceFeeRate,
    };
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your card orders and payments
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all your card orders and payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {totals.completedOrders} completed
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
              {formatCurrency(totals.totalCardValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total value of all cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Fees (15%)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totals.totalServiceFees)}
            </div>
            <p className="text-xs text-muted-foreground">15% of card orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totals.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Cards + 15% fee + printing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order History</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                All card orders with payment details (15% service fee applied)
              </p>
            </div>
            <Button onClick={() => navigate("/politician/orders/new")}>
              Place New Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cards</TableHead>
                  <TableHead className="text-right">Card Value</TableHead>
                  <TableHead className="text-right">
                    Service Fee (15%)
                  </TableHead>
                  <TableHead className="text-right">Printing</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No orders yet</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const StatusIcon = statusIcons[order.status];
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.batchId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.cardCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(order.totalCardValue)}
                        </TableCell>
                        <TableCell className="text-right text-orange-600 dark:text-orange-400">
                          {formatCurrency(order.serviceFee)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatCurrency(order.printingCost)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(order.totalPaid)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusColors[order.status]}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/politician/orders/${order.id}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Payment Info Note */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Payment Calculation:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>Card Value:</strong> Total value of all scratch cards
                ordered
              </li>
              <li>
                • <strong>Service Fee:</strong> 15% of card value (platform fee)
              </li>
              <li>
                • <strong>Printing Cost:</strong> Physical card printing charges
              </li>
              <li>
                • <strong>Total Paid:</strong> Card Value + Service Fee (15%) +
                Printing Cost
              </li>
            </ul>
            <div className="mt-3 p-3 bg-background rounded border">
              <p className="text-sm font-medium">Example:</p>
              <p className="text-sm text-muted-foreground mt-1">
                ₦10,000,000 cards → Total: ₦10,000,000 + ₦1,500,000 (15%) +
                ₦213,000 ={" "}
                <strong className="text-foreground">₦11,713,000</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
