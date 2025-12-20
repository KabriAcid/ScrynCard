import { useEffect } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FraudPage() {
  const { fraudAlerts, isLoading, fetchFraudAlerts, reviewFraud } =
    useAdminStore();

  useEffect(() => {
    fetchFraudAlerts();
  }, [fetchFraudAlerts]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totalAlerts = fraudAlerts.length;
  const openAlerts = fraudAlerts.filter(
    (a) => a.decision === "pending_review"
  ).length;
  const resolvedAlerts = totalAlerts - openAlerts;

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

      <Card>
        <CardHeader>
          <CardTitle>Fraud Alerts ({fraudAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fraudAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-mono text-xs">
                    {alert.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.riskLevel === "critical"
                          ? "destructive"
                          : alert.riskLevel === "high"
                          ? "secondary"
                          : "default"
                      }
                      className="capitalize"
                    >
                      {alert.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {alert.flags.slice(0, 2).map((flag) => (
                        <Badge
                          key={flag.code}
                          variant="outline"
                          className="text-xs"
                        >
                          {flag.code}
                        </Badge>
                      ))}
                      {alert.flags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{alert.flags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.decision === "approved"
                          ? "default"
                          : alert.decision === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {alert.decision}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {alert.decision === "pending_review" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => reviewFraud(alert.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => reviewFraud(alert.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
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
