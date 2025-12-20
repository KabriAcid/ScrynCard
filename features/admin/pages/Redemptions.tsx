import { Suspense } from "react";
import { Gift } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";
import { InstantLink } from "@/components/instant-link";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

async function getRedemptionsData() {
  await simulateDelay(800);

  const redemptions = await prisma.redemption.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      citizen: true,
      scratchCard: {
        include: {
          order: {
            include: {
              politician: true,
            },
          },
        },
      },
    },
  });

  return redemptions;
}

async function RedemptionsContent() {
  const redemptions = await getRedemptionsData();

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value: string) => (
        <span className="font-mono text-xs">{value.slice(0, 8)}...</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "citizen",
      label: "Citizen",
      render: (value: any) => value?.name || "Unknown",
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => `₦${value.toLocaleString()}`,
    },
    {
      key: "scratchCard",
      label: "Politician",
      render: (value: any) => value?.order?.politician?.name || "Unknown",
    },
    {
      key: "bankName",
      label: "Bank",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          variant={
            value === "COMPLETED"
              ? "default"
              : value === "PENDING"
              ? "secondary"
              : "destructive"
          }
          className={cn("capitalize", {
            "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300":
              value === "COMPLETED",
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300":
              value === "PENDING",
            "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300":
              value === "FAILED",
          })}
        >
          {value.toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string) => (
        <Button asChild variant="outline" size="sm">
          <InstantLink href={`/admin/redemptions/${value}`}>View</InstantLink>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Redemptions</h1>
          <p className="mt-2 text-muted-foreground">
            All platform redemptions across politicians
          </p>
        </div>
        <Button variant="outline">
          <Gift className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <DataTable
        title="All Redemptions"
        description={`Showing ${redemptions.length} redemptions`}
        columns={columns}
        data={redemptions}
      />
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
