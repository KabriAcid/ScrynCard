import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Calendar,
  Hash,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface OrderInfo {
  orderId: string;
  batchId: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  orderDate: string;
  cardCount: number;
  expiresAt: string;
  deliveredAt?: string;
  paymentReference?: string;
}

interface OrderInfoSectionProps {
  orderInfo: OrderInfo;
}

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

export function OrderInfoSection({ orderInfo }: OrderInfoSectionProps) {
  const StatusIcon = statusIcons[orderInfo.status];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Order Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="font-medium flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            {orderInfo.orderId}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Batch ID</p>
          <p className="font-medium">{orderInfo.batchId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {format(new Date(orderInfo.orderDate), "PPP")}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge variant="secondary" className={statusColors[orderInfo.status]}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {orderInfo.status}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Cards</p>
          <p className="font-medium">
            {orderInfo.cardCount.toLocaleString()} cards
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Expires On</p>
          <p className="font-medium">
            {format(new Date(orderInfo.expiresAt), "PPP")}
          </p>
        </div>
        {orderInfo.paymentReference && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Payment Reference</p>
            <p className="font-medium font-mono text-sm">
              {orderInfo.paymentReference}
            </p>
          </div>
        )}
        {orderInfo.deliveredAt && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Delivered On</p>
            <p className="font-medium">
              {format(new Date(orderInfo.deliveredAt), "PPP")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
