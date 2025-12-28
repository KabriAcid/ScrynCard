import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { mockOrders, mockScratchCards, mockRedemptions } from "@/lib/mock";
import { Order, ScratchCard, Redemption } from "@/lib/mockTypes";
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Hash,
  FileText,
  TrendingUp,
  Banknote,
  Receipt,
  Printer,
  CircleDollarSign,
  User,
  AlertTriangle,
} from "lucide-react";

function CampaignDetailsSkeleton() {
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

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Order | null>(null);
  const [cards, setCards] = useState<ScratchCard[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the campaign/order
      const foundCampaign = mockOrders.find((o) => o.id === id);
      setCampaign(foundCampaign || null);

      // Find cards for this campaign
      if (foundCampaign) {
        const campaignCards = mockScratchCards.filter(
          (c) =>
            c.orderId === foundCampaign.id ||
            c.batchId === foundCampaign.batchId
        );
        setCards(campaignCards);

        // Find redemptions for these cards
        const cardIds = campaignCards.map((c) => c.id);
        const campaignRedemptions = mockRedemptions.filter((r) =>
          cardIds.includes(r.cardId)
        );
        setRedemptions(campaignRedemptions);
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!campaign) return null;

    const activeCards = cards.filter((c) => c.status === "active").length;
    const redeemedCards = cards.filter((c) => c.status === "redeemed").length;
    const expiredCards = cards.filter((c) => c.status === "expired").length;
    const blockedCards = cards.filter((c) => c.status === "blocked").length;

    const totalRedeemed = redemptions.reduce((sum, r) => sum + r.amount, 0);
    const completedRedemptions = redemptions.filter(
      (r) => r.status === "completed"
    ).length;
    const redemptionRate =
      campaign.cardCount > 0
        ? Math.round((redeemedCards / campaign.cardCount) * 100)
        : 0;

    return {
      activeCards,
      redeemedCards,
      expiredCards,
      blockedCards,
      totalRedeemed,
      completedRedemptions,
      redemptionRate,
    };
  }, [campaign, cards, redemptions]);

  if (isLoading) {
    return <CampaignDetailsSkeleton />;
  }

  if (!campaign) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/campaigns")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Campaign Not Found</h3>
              <p className="text-muted-foreground">
                The campaign you're looking for doesn't exist or has been
                removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/admin/campaigns")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Campaigns
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                campaign.politician?.fullName === "Dikko Umar Radda"
                  ? "/img/dikko-radda.png"
                  : undefined
              }
            />
            <AvatarFallback className="text-lg">
              {campaign.politician?.fullName
                .split(" ")
                .map((n) => n[0])
                .join("") || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{campaign.batchId}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={
                  campaign.politician?.party === "APC"
                    ? "border-green-500 text-green-600"
                    : campaign.politician?.party === "PDP"
                    ? "border-red-500 text-red-600"
                    : campaign.politician?.party === "LP"
                    ? "border-purple-500 text-purple-600"
                    : ""
                }
              >
                {campaign.politician?.party}
              </Badge>
              {getStatusBadge(campaign.status)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {campaign.status === "pending" && (
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          )}
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Issued</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.cardCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeCards.toLocaleString()} active •{" "}
              {stats?.redeemedCards.toLocaleString()} redeemed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{campaign.totalCardValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Face value of all cards
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Amount Redeemed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats?.totalRedeemed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedRedemptions} successful redemptions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Redemption Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.redemptionRate}%</div>
            <Progress value={stats?.redemptionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Campaign & Politician Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Details Tabs */}
          <Card>
            <Tabs defaultValue="details" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="denominations">Denominations</TabsTrigger>
                  <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="details" className="mt-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <InfoRow
                        icon={<Hash className="h-4 w-4" />}
                        label="Batch ID"
                        value={
                          <span className="font-mono">{campaign.batchId}</span>
                        }
                      />
                      <Separator />
                      <InfoRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Created Date"
                        value={new Date(campaign.createdAt).toLocaleDateString(
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
                        value={new Date(campaign.expiresAt).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <InfoRow
                        icon={<Receipt className="h-4 w-4" />}
                        label="Payment Reference"
                        value={
                          <span className="font-mono">
                            {campaign.paymentReference || "N/A"}
                          </span>
                        }
                      />
                      <Separator />
                      {campaign.deliveredAt && (
                        <>
                          <InfoRow
                            icon={<CheckCircle className="h-4 w-4" />}
                            label="Delivered Date"
                            value={new Date(
                              campaign.deliveredAt
                            ).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          />
                          <Separator />
                        </>
                      )}
                      <InfoRow
                        icon={<Package className="h-4 w-4" />}
                        label="Status"
                        value={getStatusBadge(campaign.status)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="denominations" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Denomination</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaign.denominations.map((denom, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            ₦{denom.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {denom.quantity.toLocaleString()} cards
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ₦{denom.subtotal.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Card Value
                      </span>
                      <span className="font-medium">
                        ₦{campaign.totalCardValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Service Fee (10%)
                      </span>
                      <span className="font-medium">
                        ₦{campaign.serviceFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Printing Cost
                      </span>
                      <span className="font-medium">
                        ₦{campaign.printingCost.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Paid</span>
                      <span>₦{campaign.totalPaid.toLocaleString()}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="redemptions" className="mt-0">
                  {redemptions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Citizen</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Bank</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {redemptions.slice(0, 5).map((redemption) => (
                          <TableRow key={redemption.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {redemption.citizen?.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("") || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {redemption.citizen?.fullName || "Unknown"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              ₦{redemption.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {redemption.bankName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  redemption.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  redemption.status === "completed"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : ""
                                }
                              >
                                {redemption.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(
                                redemption.createdAt
                              ).toLocaleDateString("en-NG")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-8 text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">
                        No Redemptions Yet
                      </h3>
                      <p className="text-muted-foreground">
                        Cards from this campaign haven't been redeemed.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Card Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Card Status Distribution
              </CardTitle>
              <CardDescription>
                Overview of all cards in this campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.activeCards.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.redeemedCards.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Redeemed</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {stats?.expiredCards.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats?.blockedCards.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Politician & Cost Info */}
        <div className="space-y-6">
          {/* Politician Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Politician
              </CardTitle>
              <CardDescription>Campaign owner details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      campaign.politician?.fullName === "Dikko Umar Radda"
                        ? "/img/dikko-radda.png"
                        : undefined
                    }
                  />
                  <AvatarFallback>
                    {campaign.politician?.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{campaign.politician?.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.politician?.position}
                  </p>
                </div>
              </div>
              <Separator />
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={campaign.politician?.email || "N/A"}
              />
              <Separator />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={campaign.politician?.phone || "N/A"}
              />
              <Separator />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={`${campaign.politician?.lga}, ${campaign.politician?.state}`}
              />
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() =>
                  navigate(`/admin/politicians/${campaign.politicianId}`)
                }
              >
                View Full Profile
              </Button>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Card Value</span>
                </div>
                <span className="font-medium">
                  ₦{campaign.totalCardValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Service Fee</span>
                </div>
                <span className="font-medium">
                  ₦{campaign.serviceFee.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Printing</span>
                </div>
                <span className="font-medium">
                  ₦{campaign.printingCost.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold">
                  ₦{campaign.totalPaid.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {campaign.status === "pending" && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Campaign
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Campaign
                  </Button>
                </>
              )}
              {campaign.status === "processing" && (
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Flag for Review
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
