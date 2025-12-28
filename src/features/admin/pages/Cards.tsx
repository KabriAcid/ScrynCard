import { CreditCard, Layers, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockScratchCards } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CardsPage() {
  const cards = mockScratchCards;
  const totalCards = cards.length;
  const activeCards = cards.filter((c) => c.status === "active").length;
  const redeemedCards = cards.filter((c) => c.status === "redeemed").length;

  const kpis = [
    {
      icon: Layers,
      label: "Total Cards",
      value: totalCards.toLocaleString(),
    },
    {
      icon: CreditCard,
      label: "Active Cards",
      value: activeCards.toLocaleString(),
    },
    {
      icon: CheckCircle,
      label: "Redeemed",
      value: redeemedCards.toLocaleString(),
    },
    {
      icon: XCircle,
      label: "Redemption Rate",
      value:
        totalCards > 0
          ? `${Math.round((redeemedCards / totalCards) * 100)}%`
          : "0%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Card Batches</h1>
        <p className="mt-2 text-muted-foreground">
          Manage scratch card inventory
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scratch Cards ({cards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Code</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-mono text-xs">
                    ****-{card.code.slice(-4)}
                  </TableCell>
                  <TableCell>₦{card.denomination.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        card.status === "active" ? "secondary" : "default"
                      }
                    >
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(card.createdAt).toLocaleDateString()}
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
