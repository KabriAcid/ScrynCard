import { Suspense } from "react";
import { Megaphone, Plus } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";
import prisma from "@/lib/prisma";

async function getCampaignsData() {
  await simulateDelay(800);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      politician: true,
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
  });

  return orders;
}

async function CampaignsContent() {
  const campaigns = await getCampaignsData();

  const columns = [
    {
      key: "id",
      label: "Campaign ID",
      render: (value: string) => (
        <span className="font-mono text-xs">{value.slice(0, 8)}...</span>
      ),
    },
    {
      key: "politician",
      label: "Politician",
      render: (value: any) => value?.name || "Unknown",
    },
    {
      key: "totalAmount",
      label: "Total Value",
      render: (value: number) => `₦${value.toLocaleString()}`,
    },
    {
      key: "_count",
      label: "Card Types",
      render: (value: any) => value.items,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          variant={
            value === "COMPLETED"
              ? "default"
              : value === "PROCESSING"
              ? "secondary"
              : "destructive"
          }
          className="capitalize"
        >
          {value.toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="mt-2 text-muted-foreground">
            Manage campaigns across all politicians
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <DataTable
        title="All Campaigns"
        description={`Showing ${campaigns.length} campaigns`}
        columns={columns}
        data={campaigns}
      />
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CampaignsContent />
    </Suspense>
  );
}
