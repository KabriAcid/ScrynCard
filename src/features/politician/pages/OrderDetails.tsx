import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import type { Order } from "@/lib/mockTypes";
import { adminService } from "@/services/mockService";
import { useToast } from "@/hooks/use-toast";
import {
  OrderInfoSection,
  PaymentDetailsSection,
  BankTransferSection,
  CardBreakdownSection,
  RedemptionDetailsSkeleton,
} from "./components";

// Mock bank account - in real app, this would come from your backend
const COMPANY_BANK_ACCOUNT = {
  bankName: "Zenith Bank PLC",
  accountNumber: "2087654321",
  accountName: "ScrynCard Technologies Ltd",
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await adminService.getOrderDetails(id);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          toast({
            variant: "destructive",
            title: "Order Not Found",
            description:
              response.error || "The order you're looking for does not exist.",
          });
          setOrder(null);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error Loading Order",
          description: "Failed to load order details. Please try again.",
        });
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, toast]);

  if (isLoading) {
    return <RedemptionDetailsSkeleton />;
  }

  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The order you're looking for does not exist.</p>
          <Button
            onClick={() => navigate("/politician/orders")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/politician/orders")}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            Complete information for order {order.batchId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <OrderInfoSection
            orderInfo={{
              orderId: order.id,
              batchId: order.batchId,
              status: order.status,
              orderDate: order.createdAt,
              cardCount: order.cardCount,
              expiresAt: order.expiresAt,
              deliveredAt: order.deliveredAt,
              paymentReference: order.paymentReference,
            }}
          />

          <Separator />

          <PaymentDetailsSection
            paymentDetails={{
              cardValue: order.totalCardValue,
              serviceFee: order.serviceFee,
              printingCost: order.printingCost,
              totalPaid: order.totalPaid,
              serviceFeeRate: 0.15,
            }}
          />

          <Separator />

          <BankTransferSection
            transferInfo={{
              ...COMPANY_BANK_ACCOUNT,
              reference: order.paymentReference || `SCRYN-${order.id}`,
            }}
          />

          <Separator />

          <CardBreakdownSection denominations={order.denominations} />
        </CardContent>
      </Card>
    </div>
  );
}
