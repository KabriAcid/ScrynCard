import { useParams, useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Vote,
  Building2,
  Activity,
  FileText,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockCitizens,
  mockRedemptions,
  mockScratchCards,
} from "@/lib/mockData";
import { Redemption, ScratchCard } from "@/lib/mockTypes";

export default function CitizenDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const citizen = mockCitizens.find((c) => c.id === id);

  // Get all redemptions for this citizen
  const citizenRedemptions = useMemo(() => {
    return mockRedemptions.filter((r) => r.citizenId === id);
  }, [id]);

  // Calculate aggregated data
  const citizenData = useMemo(() => {
    if (!citizen) return null;

    const totalRedemptions = citizenRedemptions.length;
    const totalAmountRedeemed = citizenRedemptions.reduce(
      (sum, r) => sum + r.amount,
      0
    );

    // Get unique bank accounts
    const bankAccounts = citizenRedemptions.reduce(
      (acc, r) => {
        const exists = acc.find(
          (a) =>
            a.accountNumber === r.accountNumber && a.bankName === r.bankName
        );
        if (!exists) {
          acc.push({
            bankName: r.bankName,
            accountNumber: r.accountNumber,
            usedCount: 1,
            totalAmount: r.amount,
          });
        } else {
          exists.usedCount += 1;
          exists.totalAmount += r.amount;
        }
        return acc;
      },
      [] as {
        bankName: string;
        accountNumber: string;
        usedCount: number;
        totalAmount: number;
      }[]
    );

    // Get the most recent redemption for additional data
    const sortedRedemptions = [...citizenRedemptions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const latestRedemption = sortedRedemptions[0];

    // Get cards redeemed
    const cardsRedeemed = citizenRedemptions.map((r) => {
      const card = mockScratchCards.find((c) => c.id === r.cardId);
      return { ...r, card };
    });

    return {
      ...citizen,
      totalRedemptions,
      totalAmountRedeemed,
      lastRedemptionDate: latestRedemption?.createdAt || null,
      favoriteParty: latestRedemption?.favoriteParty || null,
      hasVotersCard: latestRedemption?.hasVotersCard ?? null,
      dob: latestRedemption?.dob || null,
      bankAccounts,
      cardsRedeemed,
    };
  }, [citizen, citizenRedemptions]);

  if (!citizen || !citizenData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/citizens")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Citizens
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Citizen Not Found</h3>
            <p className="text-muted-foreground">
              The citizen you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/admin/citizens")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Citizens
      </Button>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {citizenData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{citizenData.fullName}</h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{citizenData.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{citizenData.phone}</span>
                </div>
                {citizenData.dob && (
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      DOB:{" "}
                      {new Date(citizenData.dob).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3">
                  {getKycBadge(citizenData.kycStatus)}
                  {citizenData.hasVotersCard === true && (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-600"
                    >
                      <Vote className="mr-1 h-3 w-3" />
                      Has Voter's Card
                    </Badge>
                  )}
                  {getPartyBadge(citizenData.favoriteParty)}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-2xl font-bold">
                    {citizenData.totalRedemptions}
                  </p>
                  <p className="text-xs text-muted-foreground">Redemptions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Banknote className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-2xl font-bold">
                    ₦{citizenData.totalAmountRedeemed.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Redeemed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="redemptions">
            Redemptions ({citizenData.totalRedemptions})
          </TabsTrigger>
          <TabsTrigger value="bank-accounts">
            Bank Accounts ({citizenData.bankAccounts.length})
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{citizenData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{citizenData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{citizenData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="font-medium">
                      {citizenData.dob
                        ? new Date(citizenData.dob).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identity Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Identity Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">BVN</p>
                    <p className="font-medium font-mono">
                      {citizenData.bvn
                        ? `****${citizenData.bvn.slice(-4)}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NIN</p>
                    <p className="font-medium font-mono">
                      {citizenData.nin
                        ? `****${citizenData.nin.slice(-4)}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">KYC Status</p>
                    <div className="mt-1">
                      {getKycBadge(citizenData.kycStatus)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verified</p>
                    <div className="mt-1">
                      {citizenData.verified ? (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          No
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Political Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5" />
                  Political Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Favorite Party
                    </p>
                    <div className="mt-1">
                      {getPartyBadge(citizenData.favoriteParty)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Has Voter's Card
                    </p>
                    <div className="mt-1">
                      {citizenData.hasVotersCard === true ? (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Yes
                        </Badge>
                      ) : citizenData.hasVotersCard === false ? (
                        <Badge variant="outline">
                          <XCircle className="mr-1 h-3 w-3" />
                          No
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Redemptions
                    </p>
                    <p className="text-xl font-bold">
                      {citizenData.totalRedemptions}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Amount Redeemed
                    </p>
                    <p className="text-xl font-bold">
                      ₦{citizenData.totalAmountRedeemed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Bank Accounts Used
                    </p>
                    <p className="text-xl font-bold">
                      {citizenData.bankAccounts.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {new Date(citizenData.createdAt).toLocaleDateString(
                        "en-NG",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Redemptions Tab */}
        <TabsContent value="redemptions">
          <Card>
            <CardHeader>
              <CardTitle>Redemption History</CardTitle>
            </CardHeader>
            <CardContent>
              {citizenRedemptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Card</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citizenRedemptions
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((redemption) => {
                        const card = mockScratchCards.find(
                          (c) => c.id === redemption.cardId
                        );
                        return (
                          <TableRow key={redemption.id}>
                            <TableCell>
                              {new Date(
                                redemption.createdAt
                              ).toLocaleDateString("en-NG", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell>
                              <Link
                                to={`/admin/cards/${redemption.cardId}`}
                                className="text-primary hover:underline"
                              >
                                {card?.serialNumber || redemption.cardId}
                              </Link>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₦{redemption.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{redemption.bankName}</p>
                                <p className="text-muted-foreground font-mono">
                                  ****{redemption.accountNumber.slice(-4)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(redemption.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/admin/cards/${redemption.cardId}`)
                                }
                              >
                                <Eye className="mr-1 h-3.5 w-3.5" />
                                View Card
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No Redemptions Yet
                  </h3>
                  <p className="text-muted-foreground">
                    This citizen hasn't redeemed any scratch cards yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Accounts Tab */}
        <TabsContent value="bank-accounts">
          <Card>
            <CardHeader>
              <CardTitle>Bank Accounts Used</CardTitle>
            </CardHeader>
            <CardContent>
              {citizenData.bankAccounts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Times Used</TableHead>
                      <TableHead>Total Received</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citizenData.bankAccounts.map((account, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {account.bankName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          ****{account.accountNumber.slice(-4)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {account.usedCount}x
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₦{account.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No Bank Accounts
                  </h3>
                  <p className="text-muted-foreground">
                    No bank accounts have been used for redemptions yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
