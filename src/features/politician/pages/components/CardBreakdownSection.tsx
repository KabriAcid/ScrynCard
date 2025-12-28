import { CreditCard, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DenominationBreakdown {
  amount: number;
  quantity: number;
  subtotal: number;
}

interface CardBreakdownSectionProps {
  denominations: DenominationBreakdown[];
}

export function CardBreakdownSection({
  denominations,
}: CardBreakdownSectionProps) {
  const totalCards = denominations.reduce((sum, d) => sum + d.quantity, 0);
  const totalValue = denominations.reduce((sum, d) => sum + d.subtotal, 0);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" />
        Card Breakdown
      </h3>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Denomination</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {denominations.map((denom, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {formatCurrency(denom.amount)}
                </TableCell>
                <TableCell className="text-right">
                  {denom.quantity.toLocaleString()} cards
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(denom.subtotal)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-bold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">
                {totalCards.toLocaleString()} cards
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalValue)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Card Distribution</p>
            <p className="text-xs text-muted-foreground">
              Your order contains {totalCards.toLocaleString()} scratch cards
              across {denominations.length} denomination
              {denominations.length !== 1 ? "s" : ""}. Cards will be delivered
              after payment confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
