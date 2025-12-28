import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Users,
  CheckCircle2,
  Activity,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  Calendar,
  Vote,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { mockCitizens, mockRedemptions } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Citizen, Redemption } from "@/lib/mockTypes";

// Extended citizen profile with redemption data
interface CitizenProfile extends Citizen {
  totalRedemptions: number;
  totalAmountRedeemed: number;
  lastRedemptionDate: string | null;
  favoriteParty: string | null;
  hasVotersCard: boolean | null;
  dob: string | null;
  bankAccounts: { bankName: string; accountNumber: string }[];
}

// Skeleton Loading Component
function CitizensPageSkeleton() {
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
                <Skeleton className="h-10 w-10 rounded-full" />
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

export default function CitizensPage() {
  const navigate = useNavigate();
  const citizens = mockCitizens;
  const redemptions = mockRedemptions;

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [kycFilter, setKycFilter] = useState("all");
  const [partyFilter, setPartyFilter] = useState("all");
  const [votersCardFilter, setVotersCardFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulate loading
  const [isLoading] = useState(false);

  // Build citizen profiles from redemption data
  const citizenProfiles: CitizenProfile[] = useMemo(() => {
    return citizens.map((citizen) => {
      // Get all redemptions for this citizen
      const citizenRedemptions = redemptions.filter(
        (r) => r.citizenId === citizen.id
      );

      // Extract unique bank accounts
      const bankAccounts = citizenRedemptions.reduce((acc, r) => {
        const exists = acc.find(
          (a) =>
            a.accountNumber === r.accountNumber && a.bankName === r.bankName
        );
        if (!exists) {
          acc.push({ bankName: r.bankName, accountNumber: r.accountNumber });
        }
        return acc;
      }, [] as { bankName: string; accountNumber: string }[]);

      // Get the most recent redemption for additional data
      const sortedRedemptions = [...citizenRedemptions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latestRedemption = sortedRedemptions[0];

      return {
        ...citizen,
        totalRedemptions: citizenRedemptions.length,
        totalAmountRedeemed: citizenRedemptions.reduce(
          (sum, r) => sum + r.amount,
          0
        ),
        lastRedemptionDate: latestRedemption?.createdAt || null,
        favoriteParty: latestRedemption?.favoriteParty || null,
        hasVotersCard: latestRedemption?.hasVotersCard ?? null,
        dob: latestRedemption?.dob || null,
        bankAccounts,
      };
    });
  }, [citizens, redemptions]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalCitizens = citizenProfiles.length;
    const verifiedCitizens = citizenProfiles.filter(
      (c) => c.kycStatus === "verified"
    ).length;
    const citizensWithRedemptions = citizenProfiles.filter(
      (c) => c.totalRedemptions > 0
    ).length;
    const totalAmountRedeemed = citizenProfiles.reduce(
      (sum, c) => sum + c.totalAmountRedeemed,
      0
    );
    const citizensWithVotersCard = citizenProfiles.filter(
      (c) => c.hasVotersCard === true
    ).length;

    // Party distribution
    const partyDistribution = citizenProfiles.reduce((acc, c) => {
      if (c.favoriteParty) {
        acc[c.favoriteParty] = (acc[c.favoriteParty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCitizens,
      verifiedCitizens,
      citizensWithRedemptions,
      totalAmountRedeemed,
      citizensWithVotersCard,
      partyDistribution,
    };
  }, [citizenProfiles]);

  // Get unique parties
  const parties = useMemo(() => {
    const partySet = new Set(
      citizenProfiles.map((c) => c.favoriteParty).filter(Boolean)
    );
    return Array.from(partySet) as string[];
  }, [citizenProfiles]);

  // Filtered data
  const filteredCitizens = useMemo(() => {
    return citizenProfiles.filter((citizen) => {
      const matchesSearch =
        searchQuery === "" ||
        citizen.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        citizen.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        citizen.phone.includes(searchQuery);

      const matchesKyc = kycFilter === "all" || citizen.kycStatus === kycFilter;

      const matchesParty =
        partyFilter === "all" || citizen.favoriteParty === partyFilter;

      const matchesVotersCard =
        votersCardFilter === "all" ||
        (votersCardFilter === "yes" && citizen.hasVotersCard === true) ||
        (votersCardFilter === "no" && citizen.hasVotersCard === false);

      return matchesSearch && matchesKyc && matchesParty && matchesVotersCard;
    });
  }, [citizenProfiles, searchQuery, kycFilter, partyFilter, votersCardFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCitizens.length / itemsPerPage);
  const paginatedCitizens = filteredCitizens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getKycBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPartyBadge = (party: string | null) => {
    if (!party) return <span className="text-muted-foreground">—</span>;

    const partyColors: Record<string, string> = {
      APC: "border-green-500 text-green-600",
      PDP: "border-red-500 text-red-600",
      LP: "border-purple-500 text-purple-600",
      NNPP: "border-blue-500 text-blue-600",
      APGA: "border-orange-500 text-orange-600",
      SDP: "border-yellow-500 text-yellow-600",
    };

    return (
      <Badge variant="outline" className={partyColors[party] || ""}>
        {party}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Citizens Directory</h1>
          <p className="mt-2 text-muted-foreground">
            Citizen profiles from redemption data
          </p>
        </div>
        <CitizensPageSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Citizens Directory</h1>
          <p className="mt-2 text-muted-foreground">
            Citizen profiles built from redemption data
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Citizens
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.totalCitizens.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.citizensWithRedemptions} with redemptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Verified</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.verifiedCitizens.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.totalCitizens > 0
                ? Math.round((kpis.verifiedCitizens / kpis.totalCitizens) * 100)
                : 0}
              % verification rate
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
              ₦{kpis.totalAmountRedeemed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all citizens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              With Voter's Card
            </CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.citizensWithVotersCard.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Registered voters</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={kycFilter}
          onValueChange={(value) => {
            setKycFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="KYC Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All KYC Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={partyFilter}
          onValueChange={(value) => {
            setPartyFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Party" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parties</SelectItem>
            {parties.map((party) => (
              <SelectItem key={party} value={party}>
                {party}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={votersCardFilter}
          onValueChange={(value) => {
            setVotersCardFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Voter's Card" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Has Voter's Card</SelectItem>
            <SelectItem value="no">No Voter's Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Citizens ({filteredCitizens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedCitizens.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Redemptions</TableHead>
                    <TableHead>Total Redeemed</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Voter's Card</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCitizens.map((citizen) => (
                    <TableRow key={citizen.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {citizen.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {citizen.fullName}
                            </p>
                            {citizen.dob && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(citizen.dob).toLocaleDateString(
                                  "en-NG",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{citizen.email}</p>
                          <p className="text-muted-foreground">
                            {citizen.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getKycBadge(citizen.kycStatus)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{citizen.totalRedemptions}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₦{citizen.totalAmountRedeemed.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getPartyBadge(citizen.favoriteParty)}
                      </TableCell>
                      <TableCell>
                        {citizen.hasVotersCard === true ? (
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-600"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Yes
                          </Badge>
                        ) : citizen.hasVotersCard === false ? (
                          <Badge variant="outline">
                            <XCircle className="mr-1 h-3 w-3" />
                            No
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/citizens/${citizen.id}`)
                          }
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredCitizens.length
                    )}{" "}
                    of {filteredCitizens.length} citizens
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
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Citizens Found</h3>
              <p className="text-muted-foreground">
                {searchQuery ||
                kycFilter !== "all" ||
                partyFilter !== "all" ||
                votersCardFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No citizens have been registered yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
