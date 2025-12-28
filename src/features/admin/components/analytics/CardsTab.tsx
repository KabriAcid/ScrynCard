import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Layers,
  Banknote,
} from "lucide-react";

// Mock data for cards analytics
const cardIssuanceTrends = [
  { month: "Jan", issued: 12000, redeemed: 8500, circulation: 3500 },
  { month: "Feb", issued: 15000, redeemed: 10200, circulation: 8300 },
  { month: "Mar", issued: 18000, redeemed: 12800, circulation: 13500 },
  { month: "Apr", issued: 22000, redeemed: 16500, circulation: 19000 },
  { month: "May", issued: 25000, redeemed: 19200, circulation: 24800 },
  { month: "Jun", issued: 28000, redeemed: 22100, circulation: 30700 },
  { month: "Jul", issued: 32000, redeemed: 25800, circulation: 36900 },
  { month: "Aug", issued: 35000, redeemed: 28500, circulation: 43400 },
  { month: "Sep", issued: 38000, redeemed: 31200, circulation: 50200 },
  { month: "Oct", issued: 42000, redeemed: 35600, circulation: 56600 },
  { month: "Nov", issued: 48000, redeemed: 40200, circulation: 64400 },
  { month: "Dec", issued: 55000, redeemed: 46800, circulation: 72600 },
];

const cardStatus = [
  { name: "Active", value: 72600, color: "#22c55e" },
  { name: "Redeemed", value: 46800, color: "#3b82f6" },
  { name: "Expired", value: 5200, color: "#f59e0b" },
  { name: "Cancelled", value: 1200, color: "#ef4444" },
];

const denominationBreakdown = [
  { denomination: "₦1,000", count: 45000, value: 45000000, color: "#22c55e" },
  { denomination: "₦2,000", count: 28000, value: 56000000, color: "#3b82f6" },
  { denomination: "₦5,000", count: 35000, value: 175000000, color: "#8b5cf6" },
  { denomination: "₦10,000", count: 12000, value: 120000000, color: "#f59e0b" },
  { denomination: "₦20,000", count: 5800, value: 116000000, color: "#ef4444" },
];

const orderStatus = [
  { name: "Delivered", value: 420, color: "#22c55e" },
  { name: "Processing", value: 85, color: "#3b82f6" },
  { name: "Pending", value: 42, color: "#f59e0b" },
  { name: "Cancelled", value: 12, color: "#ef4444" },
];

const redemptionRateByDenomination = [
  { denomination: "₦1,000", rate: 92 },
  { denomination: "₦2,000", rate: 88 },
  { denomination: "₦5,000", rate: 75 },
  { denomination: "₦10,000", rate: 62 },
  { denomination: "₦20,000", rate: 48 },
];

const securityMetrics = [
  { metric: "Fraud Attempts Blocked", value: 127, trend: "down", change: -18 },
  { metric: "Duplicate Scans Detected", value: 43, trend: "down", change: -25 },
  { metric: "Invalid Codes Entered", value: 892, trend: "up", change: 12 },
  { metric: "Suspicious Activity", value: 28, trend: "down", change: -32 },
];

const totalCards = cardStatus.reduce((sum, s) => sum + s.value, 0);
const totalDenominationValue = denominationBreakdown.reduce(
  (sum, d) => sum + d.value,
  0
);

export function CardsTab() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cards Issued
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCards.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Circulation
            </CardTitle>
            <Layers className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72,600</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                57.8% of total
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Card Value
            </CardTitle>
            <Banknote className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{(totalDenominationValue / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +22.8% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Redemption Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +3.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card Issuance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Card Lifecycle Trends</CardTitle>
            <CardDescription>
              Monthly card issuance, redemption, and circulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={cardIssuanceTrends}>
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="issued"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Issued"
                />
                <Bar
                  dataKey="redeemed"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Redeemed"
                />
                <Line
                  type="monotone"
                  dataKey="circulation"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b" }}
                  name="Circulation"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Card Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Card Status Distribution</CardTitle>
            <CardDescription>
              Current status of all issued cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cardStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cardStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-card p-3 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm">
                            {data.value.toLocaleString()} cards
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {((data.value / totalCards) * 100).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              {cardStatus.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm">{status.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Denomination Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Denomination Breakdown</CardTitle>
            <CardDescription>
              Cards issued by denomination value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {denominationBreakdown.map((denom) => (
                <div key={denom.denomination} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: denom.color }}
                      />
                      <span className="text-sm font-medium">
                        {denom.denomination}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {denom.count.toLocaleString()} cards
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (₦{(denom.value / 1000000).toFixed(1)}M)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(denom.count / 45000) * 100}%`,
                        backgroundColor: denom.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current status of card orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {orderStatus.map((status) => (
                <div
                  key={status.name}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    {status.name === "Delivered" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {status.name === "Processing" && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    {status.name === "Pending" && (
                      <Clock className="h-4 w-4 text-amber-500" />
                    )}
                    {status.name === "Cancelled" && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-2xl font-bold">{status.value}</p>
                  <p className="text-sm text-muted-foreground">{status.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Redemption Rate by Denomination */}
        <Card>
          <CardHeader>
            <CardTitle>Redemption Rate by Denomination</CardTitle>
            <CardDescription>
              Percentage of cards redeemed for each denomination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={redemptionRateByDenomination} layout="vertical">
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="denomination"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                  formatter={(value: number) => [`${value}%`, "Rate"]}
                />
                <Bar
                  dataKey="rate"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  name="Redemption Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Security Metrics</CardTitle>
            <CardDescription>
              Fraud detection and security statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityMetrics.map((metric) => (
                <div
                  key={metric.metric}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{metric.metric}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {metric.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={
                          metric.trend === "down"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {metric.change > 0 ? "+" : ""}
                        {metric.change}% from last month
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
