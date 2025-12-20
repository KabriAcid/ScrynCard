import { Suspense } from "react";
import { CreditCard, Plus } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";
import prisma from "@/lib/prisma";
import { Layers, CheckCircle, XCircle } from "lucide-react";

async function getCardsData() {
  await simulateDelay(800);

  const [cards, totalCards, activeCards, redeemedCards] = await Promise.all([
    prisma.scratchCard.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: {
            politician: true,
          },
        },
      },
    }),
    prisma.scratchCard.count(),
    prisma.scratchCard.count({ where: { status: "ACTIVE" } }),
    prisma.scratchCard.count({ where: { status: "REDEEMED" } }),
  ]);

  return { cards, totalCards, activeCards, redeemedCards };
}

async function CardsContent() {
  const { cards, totalCards, activeCards, redeemedCards } =
    await getCardsData();

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

  const columns = [
    {
      key: "code",
      label: "Card Code",
      render: (value: string) => (
        <span className="font-mono text-xs">****-{value.slice(-4)}</span>
      ),
    },
    {
      key: "denomination",
      label: "Amount",
      render: (value: number) => `₦${value.toLocaleString()}`,
    },
    {
      key: "order",
      label: "Politician",
      render: (value: any) => value?.politician?.name || "Unknown",
    },
    {
      key: "isRedeemed",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Redeemed" : "Active"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Issued",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Card Batches</h1>
          <p className="mt-2 text-muted-foreground">
            Manage scratch card inventory
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Batch
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <DataTable
        title="Recent Cards"
        description={`Showing ${cards.length} cards`}
        columns={columns}
        data={cards}
      />
    </div>
  );
}

export default function CardsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CardsContent />
    </Suspense>
  );
}
