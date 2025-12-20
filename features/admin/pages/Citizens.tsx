import { Suspense } from "react";
import { UserCheck } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";
import prisma from "@/lib/prisma";
import { Users, CheckCircle2, Activity } from "lucide-react";

async function getCitizensData() {
  await simulateDelay(800);

  const [citizens, totalCitizens, citizensWithRedemptions] = await Promise.all([
    prisma.citizen.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
    }),
    prisma.citizen.count(),
    prisma.citizen.count({
      where: {
        redemptions: {
          some: {},
        },
      },
    }),
  ]);

  return { citizens, totalCitizens, citizensWithRedemptions };
}

async function CitizensContent() {
  const { citizens, totalCitizens, citizensWithRedemptions } =
    await getCitizensData();

  const kpis = [
    {
      icon: Users,
      label: "Total Citizens",
      value: totalCitizens.toLocaleString(),
    },
    {
      icon: CheckCircle2,
      label: "With Redemptions",
      value: citizensWithRedemptions.toLocaleString(),
    },
    {
      icon: Activity,
      label: "Redemption Rate",
      value:
        totalCitizens > 0
          ? `${Math.round((citizensWithRedemptions / totalCitizens) * 100)}%`
          : "0%",
    },
    {
      icon: UserCheck,
      label: "Active Users",
      value: citizens.filter((c) => c._count.redemptions > 0).length.toString(),
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "phone",
      label: "Phone",
      render: (value: string) => `***${value.slice(-4)}`,
    },
    {
      key: "nin",
      label: "NIN",
      render: (value: string | null) =>
        value ? `***${value.slice(-4)}` : "N/A",
    },
    {
      key: "isVerified",
      label: "KYC Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "_count",
      label: "Redemptions",
      render: (value: any) => value.redemptions,
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Citizens Directory</h1>
        <p className="mt-2 text-muted-foreground">
          Manage registered citizens and their activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <DataTable
        title="All Citizens"
        description={`Showing ${citizens.length} citizens`}
        columns={columns}
        data={citizens}
      />
    </div>
  );
}

export default function CitizensPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CitizensContent />
    </Suspense>
  );
}
