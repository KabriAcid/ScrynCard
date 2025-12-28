import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Building2,
  MapPin,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function PoliticiansPage() {
  const navigate = useNavigate();
  const { politicians, isLoading, fetchPoliticians } = useAdminStore();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [partyFilter, setPartyFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPoliticians();
  }, [fetchPoliticians]);

  // Get unique parties and states for filter dropdowns
  const uniqueParties = useMemo(() => {
    const parties = new Set<string>();
    politicians.forEach((p) => {
      if (p.party) parties.add(p.party);
    });
    return Array.from(parties).sort();
  }, [politicians]);

  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    politicians.forEach((p) => {
      if (p.state) states.add(p.state);
    });
    return Array.from(states).sort();
  }, [politicians]);

  // Filter politicians
  const filteredPoliticians = useMemo(() => {
    return politicians.filter((politician) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        politician.fullName?.toLowerCase().includes(searchLower) ||
        politician.email?.toLowerCase().includes(searchLower) ||
        politician.party?.toLowerCase().includes(searchLower) ||
        politician.position?.toLowerCase().includes(searchLower) ||
        politician.state?.toLowerCase().includes(searchLower);

      // Party filter
      const matchesParty =
        partyFilter === "all" || politician.party === partyFilter;

      // State filter
      const matchesState =
        stateFilter === "all" || politician.state === stateFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && politician.verified) ||
        (statusFilter === "pending" && !politician.verified);

      return matchesSearch && matchesParty && matchesState && matchesStatus;
    });
  }, [politicians, searchQuery, partyFilter, stateFilter, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPoliticians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPoliticians = filteredPoliticians.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, partyFilter, stateFilter, statusFilter, itemsPerPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setPartyFilter("all");
    setStateFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    partyFilter !== "all" ||
    stateFilter !== "all" ||
    statusFilter !== "all";

  // KPI calculations
  const totalPoliticians = politicians.length;
  const verifiedPoliticians = politicians.filter((p) => p.verified).length;
  const pendingPoliticians = politicians.filter((p) => !p.verified).length;
  const verificationRate =
    totalPoliticians > 0
      ? Math.round((verifiedPoliticians / totalPoliticians) * 100)
      : 0;

  // Party distribution for display
  const partyDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    politicians.forEach((p) => {
      distribution[p.party] = (distribution[p.party] || 0) + 1;
    });
    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [politicians]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Politicians</h1>
        <p className="mt-2 text-muted-foreground">
          Manage all registered politicians who have placed card orders on the
          platform
        </p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Politicians
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPoliticians}</div>
                <p className="text-xs text-muted-foreground">
                  Registered on platform
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedPoliticians}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  {verificationRate}% verification rate
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Verification
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPoliticians}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Parties
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {partyDistribution.map(([party, count]) => (
                    <Badge key={party} variant="secondary" className="text-xs">
                      {party}: {count}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Party distribution
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Politicians Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>
                  All Politicians ({filteredPoliticians.length}
                  {hasActiveFilters && ` of ${politicians.length}`})
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
                    placeholder="Search by name, email, party, position..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={partyFilter} onValueChange={setPartyFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
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
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {uniqueStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Politician</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPoliticians.length > 0 ? (
                    paginatedPoliticians.map((politician) => (
                      <TableRow key={politician.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={
                                  politician.fullName === "Dikko Umar Radda"
                                    ? "/img/dikko-radda.png"
                                    : undefined
                                }
                              />
                              <AvatarFallback>
                                {politician.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {politician.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {politician.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              politician.party === "APC"
                                ? "border-green-500 text-green-600"
                                : politician.party === "PDP"
                                ? "border-red-500 text-red-600"
                                : politician.party === "LP"
                                ? "border-purple-500 text-purple-600"
                                : ""
                            }
                          >
                            {politician.party}
                          </Badge>
                        </TableCell>
                        <TableCell>{politician.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">
                              {politician.state}, {politician.lga}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(politician.createdAt).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              politician.verified ? "default" : "secondary"
                            }
                            className={
                              politician.verified
                                ? "bg-green-600 hover:bg-green-700"
                                : ""
                            }
                          >
                            {politician.verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/politicians/${politician.id}`)
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
                      <TableCell colSpan={7} className="h-24 text-center">
                        <p className="text-muted-foreground">
                          {hasActiveFilters
                            ? "No politicians match your filters."
                            : "No politicians found."}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filteredPoliticians.length > 0 && (
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
                    <span>of {filteredPoliticians.length} results</span>
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
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
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
        </>
      )}
    </div>
  );
}
