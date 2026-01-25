import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Redemption } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Zap,
  HardDrive,
} from "lucide-react";

interface AirtimeRedemptionTableProps {
  redemptions: Redemption[];
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function AirtimeRedemptionTable({
  redemptions,
}: AirtimeRedemptionTableProps) {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [operatorFilter, setOperatorFilter] = useState<string>("all");
  const [giftTypeFilter, setGiftTypeFilter] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get unique operators for filter dropdown
  const uniqueOperators = useMemo(() => {
    const operators = new Set<string>();
    redemptions.forEach((r) => {
      if (r.operator) operators.add(r.operator);
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
        redemption.giftCode?.toLowerCase().includes(searchLower) ||
        redemption.operator?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || redemption.status === statusFilter;

      // Operator filter
      const matchesOperator =
        operatorFilter === "all" || redemption.operator === operatorFilter;

      // Gift type filter
      const matchesGiftType =
        giftTypeFilter === "all" || redemption.giftType === giftTypeFilter;

      return (
        matchesSearch && matchesStatus && matchesOperator && matchesGiftType
      );
    });
  }, [redemptions, searchQuery, statusFilter, operatorFilter, giftTypeFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRedemptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRedemptions = filteredRedemptions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, operatorFilter, giftTypeFilter, itemsPerPage]);

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

  const getStatusBadgeColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-800";
    if (status === "failed") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getOperatorColor = (operator: string) => {
    const colors: Record<string, string> = {
      MTN: "bg-yellow-100 text-yellow-800",
      Airtel: "bg-red-100 text-red-800",
      Glo: "bg-green-100 text-green-800",
      "9Mobile": "bg-blue-100 text-blue-800",
    };
    return colors[operator] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>
              Gift Redemption History ({filteredRedemptions.length}
              {hasActiveFilters && ` of ${redemptions.length}`})
            </CardTitle>
            <CardDescription>
              An overview of all airtime/data gift redemptions.
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone, gift code, or operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
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
              <SelectTrigger className="w-[130px]">
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
              <SelectTrigger className="w-[130px]">
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
                    <TableRow
                      key={redemption.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-mono text-sm">
                        {redemption.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getOperatorColor(redemption.operator)}
                        >
                          {redemption.operator}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {redemption.giftType === "airtime" ? (
                            <>
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span className="capitalize">Airtime</span>
                            </>
                          ) : (
                            <>
                              <HardDrive className="h-4 w-4 text-blue-500" />
                              <span className="capitalize">Data</span>
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
                        {redemption.date}
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
                            navigate(`/politician/redemption/${redemption.id}`)
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
        </div>
      </CardContent>
    </Card>
  );
}
