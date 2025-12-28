import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Layers,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Banknote,
  AlertTriangle,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockScratchCards, mockOrders } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Skeleton Loading Component
function CardsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Skeletons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-10 w-full sm:w-64" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CardsPage() {
  const navigate = useNavigate();
  const cards = mockScratchCards;
  const orders = mockOrders;

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [denominationFilter, setDenominationFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulate loading (remove in production)
  const [isLoading] = useState(false);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalCards = cards.length;
    const activeCards = cards.filter((c) => c.status === "active").length;
    const redeemedCards = cards.filter((c) => c.status === "redeemed").length;
    const expiredCards = cards.filter((c) => c.status === "expired").length;
    const blockedCards = cards.filter((c) => c.status === "blocked").length;
    const totalValue = cards.reduce((sum, c) => sum + c.denomination, 0);
    const redeemedValue = cards
      .filter((c) => c.status === "redeemed")
      .reduce((sum, c) => sum + c.denomination, 0);
    const redemptionRate =
      totalCards > 0 ? Math.round((redeemedCards / totalCards) * 100) : 0;

    return {
      totalCards,
      activeCards,
      redeemedCards,
      expiredCards,
      blockedCards,
      totalValue,
      redeemedValue,
      redemptionRate,
    };
  }, [cards]);

  // Get unique denominations and batches
  const denominations = useMemo(() => {
    const denomSet = new Set(cards.map((c) => c.denomination));
    return Array.from(denomSet).sort((a, b) => a - b);
  }, [cards]);

  const batches = useMemo(() => {
    const batchSet = new Set(cards.map((c) => c.batchId).filter(Boolean));
    return Array.from(batchSet) as string[];
  }, [cards]);

  // Filtered data
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        searchQuery === "" ||
        card.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || card.status === statusFilter;

      const matchesDenomination =
        denominationFilter === "all" ||
        card.denomination === parseInt(denominationFilter);

      const matchesBatch =
        batchFilter === "all" || card.batchId === batchFilter;

      return (
        matchesSearch && matchesStatus && matchesDenomination && matchesBatch
      );
    });
  }, [cards, searchQuery, statusFilter, denominationFilter, batchFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "redeemed":
        return (
          <Badge variant="secondary">
            <CreditCard className="mr-1 h-3 w-3" />
            Redeemed
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-500">
            <Clock className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="destructive">
            <Ban className="mr-1 h-3 w-3" />
            Blocked
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get order/campaign info for a card
  const getOrderInfo = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Card Inventory</h1>
          <p className="mt-2 text-muted-foreground">
            Manage scratch card inventory and track redemptions
          </p>
        </div>
        <CardsPageSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Card Inventory</h1>
          <p className="mt-2 text-muted-foreground">
            Manage scratch card inventory and track redemptions
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.totalCards.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ₦{kpis.totalValue.toLocaleString()} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.activeCards.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for redemption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.redeemedCards.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ₦{kpis.redeemedValue.toLocaleString()} value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Redemption Rate
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.redemptionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {kpis.expiredCards} expired • {kpis.blockedCards} blocked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code or serial..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="redeemed">Redeemed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={denominationFilter}
          onValueChange={(value) => {
            setDenominationFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Denomination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Amounts</SelectItem>
            {denominations.map((denom) => (
              <SelectItem key={denom} value={denom.toString()}>
                ₦{denom.toLocaleString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={batchFilter}
          onValueChange={(value) => {
            setBatchFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map((batch) => (
              <SelectItem key={batch} value={batch}>
                {batch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scratch Cards ({filteredCards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedCards.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card Code</TableHead>
                    <TableHead>Serial</TableHead>
                    <TableHead>Denomination</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Politician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCards.map((card) => {
                    const order = getOrderInfo(card.orderId);
                    return (
                      <TableRow key={card.id}>
                        <TableCell className="font-mono text-xs">
                          {card.code.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {card.serialNumber}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₦{card.denomination.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{card.batchId}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {order?.politician?.fullName || "Unknown"}
                        </TableCell>
                        <TableCell>{getStatusBadge(card.status)}</TableCell>
                        <TableCell>
                          {new Date(card.createdAt).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/cards/${card.id}`)}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredCards.length)}{" "}
                    of {filteredCards.length} cards
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Cards Found</h3>
              <p className="text-muted-foreground">
                {searchQuery ||
                statusFilter !== "all" ||
                denominationFilter !== "all" ||
                batchFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No scratch cards have been created yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
