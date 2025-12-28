import { useEffect } from "react";
import { Gift, Calendar, Flag, Vote, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RedemptionsPage() {
  const { redemptions, isLoading, fetchRedemptions } = useAdminStore();

  useEffect(() => {
    fetchRedemptions();
  }, [fetchRedemptions]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Redemptions</h1>
        <p className="mt-2 text-muted-foreground">
          All platform redemptions across politicians
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Redemptions ({redemptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Citizen</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Voter's Card</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptions.map((redemption) => (
                <TableRow key={redemption.id}>
                  <TableCell>
                    {new Date(redemption.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {redemption.citizen?.fullName || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">
                              {redemption.dob
                                ? new Date(redemption.dob).toLocaleDateString(
                                    "en-NG",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Date of Birth</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {redemption.favoriteParty || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {redemption.hasVotersCard ? (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <X className="mr-1 h-3 w-3" />
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>₦{redemption.amount.toLocaleString()}</TableCell>
                  <TableCell>{redemption.bankName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        redemption.status === "completed"
                          ? "default"
                          : redemption.status === "processing"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {redemption.status}
                    </Badge>
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
