import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gift,
  Calendar,
  Flag,
  Vote,
  Check,
  X,
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Banknote,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function RedemptionsPage() {
  const navigate = useNavigate();
  const { redemptions, isLoading, fetchRedemptions } = useAdminStore();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [partyFilter, setPartyFilter] = useState<string>("all");
  const [votersCardFilter, setVotersCardFilter] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchRedemptions();
  }, [fetchRedemptions]);

  // Get unique parties for filter dropdown
  const uniqueParties = useMemo(() => {
    const parties = new Set<string>();
    redemptions.forEach((r) => {
      if (r.favoriteParty) parties.add(r.favoriteParty);
    });
    return Array.from(parties).sort();
  }, [redemptions]);

  // Filter redemptions
  const filteredRedemptions = useMemo(() => {
    return redemptions.filter((redemption) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        redemption.citizen?.fullName?.toLowerCase().includes(searchLower) ||
        redemption.bankName?.toLowerCase().includes(searchLower) ||
        redemption.favoriteParty?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || redemption.status === statusFilter;

      // Party filter
      const matchesParty =
        partyFilter === "all" || redemption.favoriteParty === partyFilter;

      // Voter's card filter
      const matchesVotersCard =
        votersCardFilter === "all" ||
        (votersCardFilter === "yes" && redemption.hasVotersCard) ||
        (votersCardFilter === "no" && !redemption.hasVotersCard);

      return (
        matchesSearch && matchesStatus && matchesParty && matchesVotersCard
      );
    });
  }, [redemptions, searchQuery, statusFilter, partyFilter, votersCardFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRedemptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRedemptions = filteredRedemptions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, partyFilter, votersCardFilter, itemsPerPage]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totalWithVotersCard = redemptions.filter((r) => r.hasVotersCard).length;
  const votersCardPercentage =
    redemptions.length > 0
      ? Math.round((totalWithVotersCard / redemptions.length) * 100)
      : 0;

  // Calculate additional KPIs
  const totalAmountRedeemed = redemptions.reduce((sum, r) => sum + r.amount, 0);
  const completedRedemptions = redemptions.filter(
    (r) => r.status === "completed"
  ).length;
  const successRate =
    redemptions.length > 0
      ? Math.round((completedRedemptions / redemptions.length) * 100)
      : 0;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPartyFilter("all");
    setVotersCardFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    partyFilter !== "all" ||
    votersCardFilter !== "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Redemptions</h1>
        <p className="mt-2 text-muted-foreground">
          All platform redemptions across politicians
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redemptions
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{redemptions.length}</div>
            <p className="text-xs text-muted-foreground">
              All time redemptions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              With Voter's Card
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWithVotersCard}</div>
            <p className="text-xs text-muted-foreground">
              {votersCardPercentage}% of total redemptions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redeemed
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalAmountRedeemed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time payout value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedRedemptions} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              All Redemptions ({filteredRedemptions.length}
              {hasActiveFilters && ` of ${redemptions.length}`})
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, bank, party..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={partyFilter} onValueChange={setPartyFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                {uniqueParties.map((party) => (
                  <SelectItem key={party} value={party}>
                    {party}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={votersCardFilter}
              onValueChange={setVotersCardFilter}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Voter's Card" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">With Voter's Card</SelectItem>
                <SelectItem value="no">Without Voter's Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRedemptions.length > 0 ? (
                paginatedRedemptions.map((redemption) => (
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
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/redemptions/${redemption.id}`)
                        }
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <p className="text-muted-foreground">
                      {hasActiveFilters
                        ? "No redemptions match your filters."
                        : "No redemptions found."}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredRedemptions.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>of {filteredRedemptions.length} results</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
