import { useParams, useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";
import {
  ArrowLeft,
  Gift,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  Vote,
  Flag,
  Building2,
  Hash,
  Shield,
  AlertTriangle,
  FileText,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  mockRedemptions,
  mockCitizens,
  mockScratchCards,
  mockPoliticians,
  mockOrders,
} from "@/lib/mockData";

export default function RedemptionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the redemption
  const redemption = mockRedemptions.find((r) => r.id === id);

  // Get related data
  const relatedData = useMemo(() => {
    if (!redemption) return null;

    const citizen = mockCitizens.find((c) => c.id === redemption.citizenId);
    const card = mockScratchCards.find((c) => c.id === redemption.cardId);
    const order = card ? mockOrders.find((o) => o.id === card.orderId) : null;
    const politician = order
      ? mockPoliticians.find((p) => p.id === order.politicianId)
      : null;

    // Get other redemptions by this citizen
    const citizenRedemptions = mockRedemptions.filter(
      (r) => r.citizenId === redemption.citizenId && r.id !== redemption.id
    );

    return {
      citizen,
      card,
      order,
      politician,
      citizenRedemptions,
    };
  }, [redemption]);

  if (!redemption || !relatedData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/redemptions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Redemptions
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Redemption Not Found</h3>
            <p className="text-muted-foreground">
              The redemption you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { citizen, card, order, politician, citizenRedemptions } = relatedData;

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
      case "processing":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const getPartyBadge = (party: string | null | undefined) => {
    if (!party) return <span className="text-muted-foreground">—</span>;

    const partyColors: Record<string, string> = {
      APC: "border-green-500 text-green-600 bg-green-50",
      PDP: "border-red-500 text-red-600 bg-red-50",
      LP: "border-purple-500 text-purple-600 bg-purple-50",
      NNPP: "border-blue-500 text-blue-600 bg-blue-50",
      APGA: "border-orange-500 text-orange-600 bg-orange-50",
      SDP: "border-yellow-500 text-yellow-600 bg-yellow-50",
    };

    return (
      <Badge variant="outline" className={partyColors[party] || ""}>
        <Flag className="mr-1 h-3 w-3" />
        {party}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/admin/redemptions")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Redemptions
      </Button>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">
                    ₦{redemption.amount.toLocaleString()}
                  </h1>
                  {getStatusBadge(redemption.status)}
                </div>
                <p className="text-muted-foreground mt-1">
                  Redemption ID: {redemption.id}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(redemption.createdAt).toLocaleDateString(
                      "en-NG",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Vote className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-medium">
                    {redemption.hasVotersCard ? "Yes" : "No"}
                  </p>
                  <p className="text-xs text-muted-foreground">Voter's Card</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Flag className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-medium">
                    {redemption.favoriteParty || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">Party</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Citizen Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Citizen Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {citizen ? (
              <>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {citizen.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{citizen.fullName}</p>
                    <Link
                      to={`/admin/citizens/${citizen.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{citizen.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{citizen.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">
                      {redemption.dob
                        ? new Date(redemption.dob).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">KYC Status</p>
                    <Badge
                      variant={
                        citizen.kycStatus === "verified"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        citizen.kycStatus === "verified" ? "bg-green-600" : ""
                      }
                    >
                      {citizen.kycStatus}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vote className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Has Voter's Card</span>
                  </div>
                  {redemption.hasVotersCard ? (
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Favorite Party</span>
                  </div>
                  {getPartyBadge(redemption.favoriteParty)}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Citizen information not available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-2xl font-bold">
                  ₦{redemption.amount.toLocaleString()}
                </span>
              </div>
              {getStatusBadge(redemption.status)}
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bank Name</span>
                <span className="font-medium">{redemption.bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Account Number
                </span>
                <div className="flex items-center gap-2">
                  <code className="font-mono bg-muted px-2 py-1 rounded text-sm">
                    {redemption.accountNumber}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(redemption.accountNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Account Name
                </span>
                <span className="font-medium">{redemption.accountName}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Transaction Date</span>
              <span>
                {new Date(redemption.createdAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Scratch Card Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {card ? (
              <>
                <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      Serial Number
                    </span>
                    <Link
                      to={`/admin/cards/${card.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View Card →
                    </Link>
                  </div>
                  <code className="text-lg font-mono font-bold">
                    {card.serialNumber}
                  </code>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Denomination</p>
                    <p className="font-semibold text-lg">
                      ₦{card.denomination.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        card.status === "redeemed" ? "default" : "secondary"
                      }
                      className={
                        card.status === "redeemed" ? "bg-green-600" : ""
                      }
                    >
                      {card.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Batch</p>
                    <p className="font-medium">{card.batchId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Card information not available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign/Politician Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Campaign Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {politician ? (
              <>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {politician.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{politician.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {politician.party} • {politician.position}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">State</span>
                    <span className="font-medium">{politician.state}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">LGA</span>
                    <span className="font-medium">{politician.lga}</span>
                  </div>
                  {order && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Order ID</span>
                        <Link
                          to={`/admin/campaigns/${order.id}`}
                          className="text-primary hover:underline"
                        >
                          {order.id}
                        </Link>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Campaign</span>
                        <span className="font-medium">Order #{order.id}</span>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() =>
                    navigate(`/admin/politicians/${politician.id}`)
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Politician Profile
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Campaign source not available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Other Redemptions by Citizen */}
      {citizenRedemptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Other Redemptions by This Citizen ({citizenRedemptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {citizenRedemptions.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Gift className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        ₦{r.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        • {r.bankName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(r.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/redemptions/${r.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {citizenRedemptions.length > 5 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  + {citizenRedemptions.length - 5} more redemptions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fraud/Risk Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Identity Verified</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Citizen's KYC status is {citizen?.kycStatus || "unknown"}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                {citizenRedemptions.length > 5 ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <span className="font-medium">Redemption Frequency</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {citizenRedemptions.length + 1} total redemptions by this
                citizen
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Bank Account</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Account verified with {redemption.bankName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
