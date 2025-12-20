import { UserCheck, Users, CheckCircle2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCitizens } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CitizensPage() {
  const citizens = mockCitizens;
  const totalCitizens = citizens.length;
  const verifiedCitizens = citizens.filter((c) => c.verified).length;

export default function CitizensPage() {
  const citizens = mockCitizens;
  const totalCitizens = citizens.length;
  const verifiedCitizens = citizens.filter((c) => c.verified).length;

  const kpis = [
    {
      icon: Users,
      label: "Total Citizens",
      value: totalCitizens.toLocaleString(),
    },
    {
      icon: CheckCircle2,
      label: "Verified Citizens",
      value: verifiedCitizens.toLocaleString(),
    },
    {
      icon: Activity,
      label: "Verification Rate",
      value:
        totalCitizens > 0
          ? `${Math.round((verifiedCitizens / totalCitizens) * 100)}%`
          : "0%",
    },
    {
      icon: UserCheck,
      label: "Active Users",
      value: citizens.filter((c) => c.kycStatus === "verified").length.toString(),
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

      <Card>
        <CardHeader>
          <CardTitle>All Citizens ({citizens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citizens.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell className="font-medium">{citizen.fullName}</TableCell>
                  <TableCell>***{citizen.phone.slice(-4)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {citizen.kycStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={citizen.verified ? "default" : "secondary"}>
                      {citizen.verified ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(citizen.createdAt).toLocaleDateString()}
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
