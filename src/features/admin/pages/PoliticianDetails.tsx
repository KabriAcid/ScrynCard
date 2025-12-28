import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockPoliticians } from "@/lib/mock";
import { mockOrders } from "@/lib/mock";
import { Politician, Order } from "@/lib/mockTypes";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Briefcase,
  Hash,
  FileText,
  TrendingUp,
  Package,
} from "lucide-react";

function PoliticianDetailsSkeleton() {
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

export default function PoliticianDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [politician, setPolitician] = useState<Politician | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the politician
      const foundPolitician = mockPoliticians.find((p) => p.id === id);
      setPolitician(foundPolitician || null);

      // Find orders for this politician
      if (foundPolitician) {
        const politicianOrders = mockOrders.filter(
          (o) => o.politicianId === foundPolitician.id
        );
        setOrders(politicianOrders);
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return <PoliticianDetailsSkeleton />;
  }

  if (!politician) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/politicians")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Politicians
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Politician Not Found
              </h3>
              <p className="text-muted-foreground">
                The politician you're looking for doesn't exist or has been
                removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = orders.length;
  const totalCardsOrdered = orders.reduce((sum, o) => sum + o.cardCount, 0);
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPaid, 0);
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/admin/politicians")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Politicians
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                politician.fullName === "Dikko Umar Radda"
                  ? "/img/dikko-radda.png"
                  : undefined
              }
            />
            <AvatarFallback className="text-lg">
              {politician.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{politician.fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
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
              <Badge
                variant={politician.verified ? "default" : "secondary"}
                className={
                  politician.verified ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {politician.verified ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!politician.verified && (
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          )}
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Card orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Ordered</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCardsOrdered.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total cards issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform contribution
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Orders
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              {totalOrders > 0
                ? `${Math.round(
                    (completedOrders / totalOrders) * 100
                  )}% completion rate`
                : "No orders yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Personal Info & Verification */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Contact and identification details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email Address"
                    value={politician.email}
                  />
                  <Separator />
                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone Number"
                    value={politician.phone}
                  />
                  <Separator />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Joined Platform"
                    value={new Date(politician.createdAt).toLocaleDateString(
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
                    icon={<Briefcase className="h-4 w-4" />}
                    label="Position"
                    value={politician.position}
                  />
                  <Separator />
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Political Party"
                    value={politician.party}
                  />
                  <Separator />
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={`${politician.lga}, ${politician.state}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>
                All card orders placed by this politician
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Cards</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.batchId}
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          {order.cardCount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₦{order.totalPaid.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : order.status === "processing"
                                ? "secondary"
                                : order.status === "pending"
                                ? "outline"
                                : "destructive"
                            }
                            className={
                              order.status === "completed"
                                ? "bg-green-600 hover:bg-green-700"
                                : ""
                            }
                          >
                            {order.status === "completed" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {order.status === "processing" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {order.status === "cancelled" && (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Orders Yet</h3>
                  <p className="text-muted-foreground">
                    This politician hasn't placed any card orders.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Verification & Security */}
        <div className="space-y-6">
          {/* Verification Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Details
              </CardTitle>
              <CardDescription>KYC and identity information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <InfoRow
                  icon={<Hash className="h-4 w-4" />}
                  label="BVN"
                  value={
                    <span className="font-mono">
                      {politician.bvn.replace(/(\d{4})/g, "$1 ").trim()}
                    </span>
                  }
                />
                <Separator />
                <InfoRow
                  icon={<FileText className="h-4 w-4" />}
                  label="NIN"
                  value={
                    <span className="font-mono">
                      {politician.nin.replace(/(\d{4})/g, "$1 ").trim()}
                    </span>
                  }
                />
                <Separator />
                <InfoRow
                  icon={<Shield className="h-4 w-4" />}
                  label="Verification Status"
                  value={
                    <Badge
                      variant={politician.verified ? "default" : "secondary"}
                      className={
                        politician.verified
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {politician.verified ? "Verified" : "Pending Review"}
                    </Badge>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!politician.verified && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Politician
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Application
                  </Button>
                </>
              )}
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
