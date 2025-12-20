import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Gift, TrendingUp, XCircle } from "lucide-react";
import type { Redemption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InstantLink } from "@/components/instant-link";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";

const redemptions: Redemption[] = [
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

async function RedemptionsTable() {
  // Simulate data fetching delay (only in development)
  await simulateDelay(800);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">S/N</TableHead>
          <TableHead className="whitespace-nowrap">Date</TableHead>
          <TableHead className="whitespace-nowrap">Citizen Name</TableHead>
          <TableHead className="whitespace-nowrap">Amount</TableHead>
          <TableHead className="whitespace-nowrap">Card Code</TableHead>
          <TableHead className="whitespace-nowrap">Bank</TableHead>
          <TableHead className="whitespace-nowrap">Status</TableHead>
          <TableHead className="whitespace-nowrap">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {redemptions.map((redemption, index) => (
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
              {redemption.cardCode}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {redemption.bank}
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
                  View Details
                </InstantLink>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function RedemptionsPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redemptions
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              1,258{" "}
              <span className="text-base text-muted-foreground">/ 10,000</span>
            </div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Payouts
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦5,231,890</div>
            <p className="text-xs text-muted-foreground">95% success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Redemption History</CardTitle>
          <CardDescription>
            An overview of all card redemptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton numRows={5} numCells={8} />}>
            <RedemptionsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
