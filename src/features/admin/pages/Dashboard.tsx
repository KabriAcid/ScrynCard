import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Zap,
  Gift,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
  CheckCircle,
  Clock,
  ShieldAlert,
  Package,
  Activity,
  BarChart3,
  CircleDollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAdminStore } from "@/stores/adminStore";
import {
  getRecentRedemptions,
  getRecentOrders,
  mockPoliticians,
  mockFraudChecks,
} from "@/lib/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Skeleton Loading Component
function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header stays visible */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's your platform summary.
        </p>
      </div>

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

      {/* Chart & Activity Skeletons */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Skeleton className="h-80 lg:col-span-4 rounded-lg" />
        <Skeleton className="h-80 lg:col-span-3 rounded-lg" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

function KPICard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: KPICardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <Badge
              variant="secondary"
              className={
                trend.isPositive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }
            >
              <TrendingUp
                className={`h-3 w-3 mr-1 ${
                  !trend.isPositive ? "rotate-180" : ""
                }`}
              />
              {trend.value}
            </Badge>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Chart color palette
const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#8b5cf6",
};

const PIE_COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { stats, isLoading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  // Mock chart data
  const redemptionTrendData = useMemo(
    () => [
      { month: "Jan", amount: 1250000, count: 145 },
      { month: "Feb", amount: 1890000, count: 198 },
      { month: "Mar", amount: 2340000, count: 267 },
      { month: "Apr", amount: 2780000, count: 312 },
      { month: "May", amount: 3120000, count: 356 },
      { month: "Jun", amount: 3560000, count: 398 },
    ],
    []
  );

  const orderStatusData = useMemo(
    () => [
      { name: "Completed", value: 45, color: CHART_COLORS.green },
      { name: "Processing", value: 28, color: CHART_COLORS.amber },
      { name: "Pending", value: 18, color: CHART_COLORS.blue },
      { name: "Cancelled", value: 9, color: CHART_COLORS.red },
    ],
    []
  );

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Failed to Load</h3>
          <p className="text-muted-foreground">
            Unable to fetch dashboard data.
          </p>
          <Button onClick={() => fetchStats()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const recentRedemptions = getRecentRedemptions(5);
  const recentOrders = getRecentOrders(3);
  const pendingFraudAlerts = mockFraudChecks.filter(
    (f) => f.decision === "pending_review"
  );
  const pendingPoliticians = mockPoliticians.filter((p) => !p.verified);

  // Calculate completion rate
  const completedRedemptions = recentRedemptions.filter(
    (r) => r.status === "completed"
  ).length;
  const completionRate = Math.round(
    (completedRedemptions / recentRedemptions.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's your platform summary.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/analytics")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          <Button onClick={() => navigate("/admin/politicians")}>
            <Users className="mr-2 h-4 w-4" />
            Manage Politicians
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Politicians"
          value={stats.totalPoliticians.toString()}
          description="Registered on platform"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: "+12%", isPositive: true }}
        />
        <KPICard
          title="Cards in Circulation"
          value={stats.totalCardsCirculation.toLocaleString()}
          description="Active scratch cards"
          icon={<CreditCard className="h-4 w-4" />}
          trend={{ value: "+8%", isPositive: true }}
        />
        <KPICard
          title="Total Redemptions"
          value={`₦${stats.totalRedemptionAmount.toLocaleString()}`}
          description="Total value redeemed"
          icon={<CircleDollarSign className="h-4 w-4" />}
          trend={{ value: "+23%", isPositive: true }}
        />
        <KPICard
          title="Success Rate"
          value={`${stats.successRate}%`}
          description="Redemption success"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: "+2.3%", isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Redemption Trend Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Redemption Trends
            </CardTitle>
            <CardDescription>
              Monthly redemption volume and value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={redemptionTrendData}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) =>
                      `₦${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `₦${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Status
            </CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Percentage"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {orderStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Card Orders
            </CardTitle>
            <CardDescription>Latest orders from politicians</CardDescription>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/cards")}>
            View All Orders
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border p-4 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "processing"
                        ? "secondary"
                        : "outline"
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
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
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
                    <p className="font-medium text-sm">
                      {order.politician?.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.politician?.party} • {order.politician?.position}
                    </p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Cards</p>
                    <p className="font-semibold">
                      {order.cardCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Value</p>
                    <p className="font-semibold">
                      ₦{order.totalCardValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
