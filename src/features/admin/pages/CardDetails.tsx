import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  mockScratchCards,
  mockOrders,
  mockRedemptions,
  mockCitizens,
} from "@/lib/mock";
import { ScratchCard, Order, Redemption, Citizen } from "@/lib/mockTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  Ban,
  Hash,
  Package,
  User,
  Banknote,
  Shield,
  AlertTriangle,
  Building2,
  FileText,
  Lock,
  Unlock,
} from "lucide-react";

function CardDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

export default function CardDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<ScratchCard | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [redemption, setRedemption] = useState<Redemption | null>(null);
  const [redeemedBy, setRedeemedBy] = useState<Citizen | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the card
      const foundCard = mockScratchCards.find((c) => c.id === id);
      setCard(foundCard || null);

      if (foundCard) {
        // Find the order/campaign
        const foundOrder = mockOrders.find((o) => o.id === foundCard.orderId);
        setOrder(foundOrder || null);

        // Find redemption if redeemed
        if (foundCard.status === "redeemed") {
          const foundRedemption = mockRedemptions.find(
            (r) => r.cardId === foundCard.id
          );
          setRedemption(foundRedemption || null);

          // Find citizen who redeemed
          if (foundCard.redeemedBy) {
            const foundCitizen = mockCitizens.find(
              (c) => c.id === foundCard.redeemedBy
            );
            setRedeemedBy(foundCitizen || null);
          }
        }
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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

  if (isLoading) {
    return <CardDetailsSkeleton />;
  }

  if (!card) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/cards")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cards
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Card Not Found</h3>
              <p className="text-muted-foreground">
                The card you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if card is expired
  const isExpired = card.expiresAt
    ? new Date(card.expiresAt) < new Date()
    : false;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/admin/cards")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cards
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono">{card.code}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">SN: {card.serialNumber}</Badge>
                {getStatusBadge(card.status)}
                {isExpired && card.status === "active" && (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-500"
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Expired
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {card.status === "active" && (
            <Button variant="destructive">
              <Ban className="mr-2 h-4 w-4" />
              Block Card
            </Button>
          )}
          {card.status === "blocked" && (
            <Button className="bg-green-600 hover:bg-green-700">
              <Unlock className="mr-2 h-4 w-4" />
              Unblock Card
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denomination</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{card.denomination.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Card face value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-1">{getStatusBadge(card.status)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {card.status === "redeemed"
                ? "Value has been claimed"
                : card.status === "active"
                ? "Ready for redemption"
                : card.status === "blocked"
                ? "Card is disabled"
                : "Card has expired"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(card.createdAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(card.createdAt).getFullYear()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expires</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.expiresAt
                ? new Date(card.expiresAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.expiresAt
                ? isExpired
                  ? "Card has expired"
                  : `${Math.ceil(
                      (new Date(card.expiresAt).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )} days remaining`
                : "No expiry set"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Card Information
              </CardTitle>
              <CardDescription>
                Unique identifiers and security details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <InfoRow
                    icon={<Hash className="h-4 w-4" />}
                    label="Card Code"
                    value={
                      <span className="font-mono text-sm">{card.code}</span>
                    }
                  />
                  <Separator />
                  <InfoRow
                    icon={<Hash className="h-4 w-4" />}
                    label="Serial Number"
                    value={
                      <span className="font-mono">{card.serialNumber}</span>
                    }
                  />
                  <Separator />
                  <InfoRow
                    icon={<Banknote className="h-4 w-4" />}
                    label="Denomination"
                    value={`₦${card.denomination.toLocaleString()}`}
                  />
                </div>
                <div className="space-y-1">
                  <InfoRow
                    icon={<Package className="h-4 w-4" />}
                    label="Batch ID"
                    value={
                      <Badge variant="outline">{card.batchId || "N/A"}</Badge>
                    }
                  />
                  <Separator />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created Date"
                    value={new Date(card.createdAt).toLocaleDateString(
                      "en-NG",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  />
                  <Separator />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Expiry Date"
                    value={
                      card.expiresAt
                        ? new Date(card.expiresAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redemption Details (if redeemed) */}
          {card.status === "redeemed" && redemption && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Redemption Details
                </CardTitle>
                <CardDescription>
                  Information about when and how this card was redeemed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <InfoRow
                      icon={<User className="h-4 w-4" />}
                      label="Redeemed By"
                      value={
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {redeemedBy?.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span>{redeemedBy?.fullName || "Unknown"}</span>
                        </div>
                      }
                    />
                    <Separator />
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Redeemed At"
                      value={
                        card.redeemedAt
                          ? new Date(card.redeemedAt).toLocaleDateString(
                              "en-NG",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "N/A"
                      }
                    />
                    <Separator />
                    <InfoRow
                      icon={<Banknote className="h-4 w-4" />}
                      label="Amount"
                      value={`₦${redemption.amount.toLocaleString()}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <InfoRow
                      icon={<Building2 className="h-4 w-4" />}
                      label="Bank"
                      value={redemption.bankName}
                    />
                    <Separator />
                    <InfoRow
                      icon={<Hash className="h-4 w-4" />}
                      label="Account Number"
                      value={
                        <span className="font-mono">
                          {redemption.accountNumber}
                        </span>
                      }
                    />
                    <Separator />
                    <InfoRow
                      icon={<User className="h-4 w-4" />}
                      label="Account Name"
                      value={redemption.accountName}
                    />
                  </div>
                </div>
                {redemption.transferReference && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">
                          Transfer Completed
                        </span>
                      </div>
                      <span className="font-mono text-sm">
                        Ref: {redemption.transferReference}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Campaign/Order Info */}
          {order && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Campaign Information
                </CardTitle>
                <CardDescription>
                  The campaign this card belongs to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          order.politician?.fullName === "Dikko Umar Radda"
                            ? "/img/dikko-radda.png"
                            : undefined
                        }
                      />
                      <AvatarFallback>
                        {order.politician?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{order.batchId}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.politician?.fullName} • {order.politician?.party}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/admin/campaigns/${order.id}`)}
                  >
                    View Campaign
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold">
                      {order.cardCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cards in Batch
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold">
                      ₦{(order.totalCardValue / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Badge
                      className={
                        order.status === "completed"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {order.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Campaign Status
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Card security information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Card Status</span>
                </div>
                {getStatusBadge(card.status)}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Fraud Score</span>
                </div>
                {redemption ? (
                  <Badge
                    variant={
                      redemption.fraudScore > 50 ? "destructive" : "secondary"
                    }
                  >
                    {redemption.fraudScore}%
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
              {card.codeHash && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Code Hash</p>
                    <p className="font-mono text-xs mt-1 break-all">
                      {card.codeHash}
                    </p>
                  </div>
                </>
              )}
              {card.checksum && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Checksum
                    </span>
                    <span className="font-mono">{card.checksum}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {card.status === "active" && (
                <Button variant="destructive" className="w-full">
                  <Ban className="mr-2 h-4 w-4" />
                  Block Card
                </Button>
              )}
              {card.status === "blocked" && (
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Unlock className="mr-2 h-4 w-4" />
                  Unblock Card
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Flag for Review
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Audit Log
              </Button>
            </CardContent>
          </Card>

          {/* Redeemed By (if applicable) */}
          {redeemedBy && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Redeemed By
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {redeemedBy.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{redeemedBy.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {redeemedBy.phone}
                    </p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{redeemedBy.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KYC Status</span>
                    <Badge
                      variant={
                        redeemedBy.kycStatus === "verified"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        redeemedBy.kycStatus === "verified"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {redeemedBy.kycStatus}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate(`/admin/citizens`)}
                >
                  View Citizen Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
