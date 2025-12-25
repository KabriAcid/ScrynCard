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
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { Redemption } from "@/lib/types";

interface RedemptionTableProps {
  redemptions: Redemption[];
}

export function RedemptionTable({ redemptions }: RedemptionTableProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redemption History</CardTitle>
        <CardDescription>An overview of all card redemptions.</CardDescription>
      </CardHeader>
      <CardContent>
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
            {redemptions.length > 0 ? (
              redemptions.map((redemption, index) => (
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/politician/redemption/${redemption.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No redemptions yet</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
