import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CreditCard,
  Users,
  Wallet,
  ArrowRight,
  Gift,
  CheckCircle,
} from "lucide-react";
import {
  RedemptionOverviewChart,
  PartyAffiliationChart,
} from "@/components/dashboard/analytics-charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DashboardSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";
import { InstantLink } from "@/components/instant-link";
import { cn } from "@/lib/utils";
import type { Redemption } from "@/lib/types";

const recentRedemptions: Redemption[] = [
  {
    id: "RED-001",
    date: "2024-03-20",
    amount: 5000,
    status: "Completed",
    citizenName: "Aisha Bello",
    cardCode: "****-1234",
    bank: "Zenith Bank",
  },
  {
    id: "RED-002",
    date: "2024-03-21",
    amount: 2000,
    status: "Completed",
    citizenName: "Chinedu Okoro",
    cardCode: "****-5678",
    bank: "GTBank",
  },
  {
    id: "RED-003",
    date: "2024-03-22",
    amount: 10000,
    status: "Pending",
    citizenName: "Fatima Garba",
    cardCode: "****-9012",
    bank: "First Bank",
  },
  {
    id: "RED-004",
    date: "2024-03-23",
    amount: 5000,
    status: "Failed",
    citizenName: "Yusuf Ahmed",
    cardCode: "****-3456",
    bank: "UBA",
  },
  {
    id: "RED-005",
    date: "2024-03-24",
    amount: 1000,
    status: "Completed",
    citizenName: "Ngozi Eze",
    cardCode: "****-7890",
    bank: "Access Bank",
  },
];

async function RedemptionsTablePreview() {
  // Simulate data fetching delay (only in development)
  await simulateDelay(600);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">S/N</TableHead>
          <TableHead className="whitespace-nowrap">Date</TableHead>
          <TableHead className="whitespace-nowrap">Citizen Name</TableHead>
          <TableHead className="whitespace-nowrap">Amount</TableHead>
          <TableHead className="whitespace-nowrap">Status</TableHead>
          <TableHead className="whitespace-nowrap">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentRedemptions.map((redemption, index) => (
          <TableRow key={redemption.id}>
            <TableCell className="font-medium whitespace-nowrap">
              {index + 1}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {redemption.date}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {redemption.citizenName}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              ₦{redemption.amount.toLocaleString()}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <Badge
                variant={
                  redemption.status === "Completed"
                    ? "default"
                    : redemption.status === "Pending"
                    ? "secondary"
                    : "destructive"
                }
                className={cn("capitalize", {
                  "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300":
                    redemption.status === "Completed",
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300":
                    redemption.status === "Pending",
                  "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300":
                    redemption.status === "Failed",
                })}
              >
                {redemption.status}
              </Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <Button asChild variant="outline" size="sm">
                <InstantLink href={`/dashboard/redemptions/${redemption.id}`}>
                  View
                </InstantLink>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function DashboardContent() {
  // Simulate data fetching delay (only in development)
  await simulateDelay(1000);

  return (
    <div className="grid gap-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redeemed
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦45,231,890</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cards in Circulation
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120,543</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citizens</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98,210</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57</div>
            <p className="text-xs text-muted-foreground">+12 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Party Affiliation Chart */}
      <PartyAffiliationChart />

      {/* Charts Grid */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <RedemptionOverviewChart />

        {/* Recent Redemptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Redemptions</CardTitle>
            <CardDescription>
              Latest card redemptions from citizens
            </CardDescription>
          </CardHeader>
          <CardContent className="no-scrollbar">
            <div className="overflow-x-auto no-scrollbar">
              <Suspense fallback={<TableSkeleton numRows={5} numCells={6} />}>
                <RedemptionsTablePreview />
              </Suspense>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button asChild variant="ghost" size="sm">
              <InstantLink href="/dashboard/redemptions">
                View All Redemptions <ArrowRight className="ml-2 h-4 w-4" />
              </InstantLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
