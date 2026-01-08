import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gift,
  Zap,
  HardDrive,
  TrendingUp,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
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

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function RedemptionsPage() {
  const navigate = useNavigate();
  const { redemptions, isLoading, fetchRedemptions } = useAdminStore();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [operatorFilter, setOperatorFilter] = useState<string>("all");
  const [giftTypeFilter, setGiftTypeFilter] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchRedemptions();
  }, [fetchRedemptions]);

  // Get unique operators for filter dropdown
  const uniqueOperators = useMemo(() => {
    const operators = new Set<string>();
    redemptions.forEach((r) => {
      if (r.mobileOperator) operators.add(r.mobileOperator);
    });
    return Array.from(operators).sort();
  }, [redemptions]);

  // Filter redemptions
  const filteredRedemptions = useMemo(() => {
    return redemptions.filter((redemption) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        redemption.phoneNumber?.toLowerCase().includes(searchLower) ||
        redemption.cardId?.toLowerCase().includes(searchLower) ||
        redemption.mobileOperator?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || redemption.status === statusFilter;

      // Operator filter
      const matchesOperator =
        operatorFilter === "all" || redemption.mobileOperator === operatorFilter;

      // Gift type filter
      const matchesGiftType =
        giftTypeFilter === "all" || redemption.giftType === giftTypeFilter;
      return (
        matchesSearch && matchesStatus && matchesOperator && matchesGiftType
      );
    });
  }, [
    redemptions,
    searchQuery,
    statusFilter,
    operatorFilter,
    giftTypeFilter,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRedemptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRedemptions = filteredRedemptions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, operatorFilter, giftTypeFilter, itemsPerPage]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate KPIs for airtime/data
  const totalAirtimeDistributed = redemptions
    .filter((r) => r.status === "completed" && r.giftType === "airtime")
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  
  const totalDataDistributed = redemptions
    .filter((r) => r.status === "completed" && r.giftType === "data")
    .reduce((sum, r) => sum + (r.dataSize || 0), 0);
  
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
    setOperatorFilter("all");
    setGiftTypeFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    operatorFilter !== "all" ||
    giftTypeFilter !== "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gift Redemptions</h1>
        <p className="mt-2 text-muted-foreground">
          All airtime and data gift redemptions across the platform
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
              All time gifts redeemed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Airtime Distributed
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalAirtimeDistributed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total airtime value sent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Distributed
            </CardTitle>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalDataDistributed / 1024)} GB
            </div>
            <p className="text-xs text-muted-foreground">
              Total data bundles sent
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
              All Gift Redemptions ({filteredRedemptions.length}
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
                placeholder="Search by phone, gift code, operator..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Operator Filter */}
            <Select value={operatorFilter} onValueChange={setOperatorFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operators</SelectItem>
                {uniqueOperators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gift Type Filter */}
            <Select value={giftTypeFilter} onValueChange={setGiftTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="airtime">Airtime</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
              </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Gift Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRedemptions.length > 0 ? (
                  paginatedRedemptions.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-mono text-sm">
                        {redemption.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <Badge className={getOperatorColor(redemption.mobileOperator)}>
                          {redemption.mobileOperator}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {redemption.giftType === "airtime" ? (
                            <>
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span>Airtime</span>
                            </>
                          ) : (
                            <>
                              <HardDrive className="h-4 w-4 text-blue-500" />
                              <span>Data</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {redemption.giftType === "data"
                          ? `${redemption.dataSize}MB`
                          : `₦${redemption.amount?.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {redemption.completedAt}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(redemption.status)}
                        >
                          {redemption.status === "completed"
                            ? "Completed"
                            : redemption.status === "failed"
                            ? "Failed"
                            : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/redemptions/${redemption.id}`)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No redemptions found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(parseInt(value))}
                >
                  <SelectTrigger className="w-[80px]">
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
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function for status badge color
function getStatusBadgeColor(status: string) {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "failed") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

// Helper function for operator color
function getOperatorColor(operator: string) {
  const colors: Record<string, string> = {
    MTN: "bg-yellow-100 text-yellow-800",
    Airtel: "bg-red-100 text-red-800",
    Glo: "bg-green-100 text-green-800",
    "9Mobile": "bg-blue-100 text-blue-800",
  };
  return colors[operator] || "bg-gray-100 text-gray-800";
}
