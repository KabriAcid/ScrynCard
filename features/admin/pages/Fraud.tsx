import { Suspense } from "react";
import { ShieldAlert } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";
import prisma from "@/lib/prisma";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

async function getFraudData() {
  await simulateDelay(800);

  const [alerts, totalAlerts, openAlerts, resolvedAlerts] = await Promise.all([
    prisma.fraudAlert.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        redemption: {
          include: {
            citizen: true,
          },
        },
        politician: true,
      },
    }),
    prisma.fraudAlert.count(),
    prisma.fraudAlert.count({ where: { resolved: false } }),
    prisma.fraudAlert.count({ where: { resolved: true } }),
  ]);

  return { alerts, totalAlerts, openAlerts, resolvedAlerts };
}

async function FraudContent() {
  const { alerts, totalAlerts, openAlerts, resolvedAlerts } =
    await getFraudData();

  const kpis = [
    {
      icon: AlertTriangle,
      label: "Total Alerts",
      value: totalAlerts.toString(),
    },
    {
      icon: Clock,
      label: "Open Alerts",
      value: openAlerts.toString(),
    },
    {
      icon: CheckCircle,
      label: "Resolved",
      value: resolvedAlerts.toString(),
    },
    {
      icon: ShieldAlert,
      label: "Resolution Rate",
      value:
        totalAlerts > 0
          ? `${Math.round((resolvedAlerts / totalAlerts) * 100)}%`
          : "0%",
    },
  ];

  const columns = [
    {
      key: "id",
      label: "Alert ID",
      render: (value: string) => (
        <span className="font-mono text-xs">{value.slice(0, 8)}...</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "severity",
      label: "Severity",
      render: (value: string) => (
        <Badge
          variant={
            value === "HIGH"
              ? "destructive"
              : value === "MEDIUM"
              ? "secondary"
              : "default"
          }
          className="capitalize"
        >
          {value.toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "politician",
      label: "Politician",
      render: (value: any) => value?.name || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          variant={value === "OPEN" ? "destructive" : "default"}
          className="capitalize"
        >
          {value.toLowerCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fraud & Risk Center</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor and manage fraud alerts across the platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <DataTable
        title="Fraud Alerts"
        description={`Showing ${alerts.length} alerts`}
        columns={columns}
        data={alerts}
      />
    </div>
  );
}

export default function FraudPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <FraudContent />
    </Suspense>
  );
}
