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
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { Redemption } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

interface RedemptionTableProps {
  redemptions: Redemption[];
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function RedemptionTable({ redemptions }: RedemptionTableProps) {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter redemptions
  const filteredRedemptions = useMemo(() => {
    return redemptions.filter((redemption) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        redemption.citizenName?.toLowerCase().includes(searchLower) ||
        redemption.bank?.toLowerCase().includes(searchLower) ||
        redemption.cardCode?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || redemption.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [redemptions, searchQuery, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRedemptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRedemptions = filteredRedemptions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, itemsPerPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>
              Redemption History ({filteredRedemptions.length}
              {hasActiveFilters && ` of ${redemptions.length}`})
            </CardTitle>
            <CardDescription>
              An overview of all card redemptions.
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
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, bank, code..."
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
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">S/N</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Citizen Name</TableHead>
              <TableHead className="whitespace-nowrap">Phone</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Card Code</TableHead>
              <TableHead className="whitespace-nowrap">Bank</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRedemptions.length > 0 ? (
              paginatedRedemptions.map((redemption, index) => (
                <TableRow key={redemption.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {redemption.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {redemption.citizenName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {redemption.phoneNumber || "N/A"}
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
                <TableCell colSpan={9} className="text-center py-8">
                  <p className="text-muted-foreground">
                    {hasActiveFilters
                      ? "No redemptions match your filters."
                      : "No redemptions yet"}
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
  );
}
