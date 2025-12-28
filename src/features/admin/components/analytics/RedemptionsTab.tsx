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
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
} from "lucide-react";

// Mock data for redemption analytics
const monthlyRedemptions = [
  { month: "Jan", completed: 2400, pending: 400, failed: 120 },
  { month: "Feb", completed: 1398, pending: 300, failed: 80 },
  { month: "Mar", completed: 9800, pending: 500, failed: 200 },
  { month: "Apr", completed: 3908, pending: 450, failed: 150 },
  { month: "May", completed: 4800, pending: 380, failed: 90 },
  { month: "Jun", completed: 3800, pending: 420, failed: 110 },
  { month: "Jul", completed: 4300, pending: 350, failed: 75 },
  { month: "Aug", completed: 5200, pending: 480, failed: 130 },
  { month: "Sep", completed: 4100, pending: 390, failed: 95 },
  { month: "Oct", completed: 4600, pending: 410, failed: 105 },
  { month: "Nov", completed: 5800, pending: 520, failed: 160 },
  { month: "Dec", completed: 6200, pending: 580, failed: 180 },
];

const statusData = [
  { name: "Completed", value: 8500, color: "#22c55e" },
  { name: "Pending", value: 1200, color: "#f59e0b" },
  { name: "Failed", value: 300, color: "#ef4444" },
];

const votersCardData = [
  { name: "With Voter's Card", value: 7200, color: "#3b82f6" },
  { name: "Without Voter's Card", value: 2800, color: "#94a3b8" },
];

const weeklyTrends = [
  { day: "Mon", redemptions: 1200 },
  { day: "Tue", redemptions: 1400 },
  { day: "Wed", redemptions: 1100 },
  { day: "Thu", redemptions: 1600 },
  { day: "Fri", redemptions: 1800 },
  { day: "Sat", redemptions: 900 },
  { day: "Sun", redemptions: 600 },
];

const topBanks = [
  { bank: "First Bank", count: 2340, percentage: 23.4 },
  { bank: "GTBank", count: 1890, percentage: 18.9 },
  { bank: "Access Bank", count: 1560, percentage: 15.6 },
  { bank: "UBA", count: 1230, percentage: 12.3 },
  { bank: "Zenith Bank", count: 1100, percentage: 11.0 },
  { bank: "Others", count: 1880, percentage: 18.8 },
];

const totalRedemptions = statusData.reduce((sum, s) => sum + s.value, 0);
const totalVotersCard = votersCardData.reduce((sum, s) => sum + s.value, 0);

export function RedemptionsTab() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redemptions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRedemptions.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Badge variant="default" className="bg-green-600">
              85%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.0%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +2.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payouts
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,200</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -5.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              With Voter's Card
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Redemption Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Redemption Trends</CardTitle>
            <CardDescription>
              Breakdown of redemptions by status over the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRedemptions}>
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#22c55e"
                  radius={[0, 0, 0, 0]}
                  name="Completed"
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[0, 0, 0, 0]}
                  name="Pending"
                />
                <Bar
                  dataKey="failed"
                  stackId="a"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Failed"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Redemption Status Distribution</CardTitle>
            <CardDescription>
              Current distribution of redemption statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
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
                            {data.value.toLocaleString()} redemptions
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {((data.value / totalRedemptions) * 100).toFixed(1)}
                            %
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
              {statusData.map((status) => (
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
        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Pattern</CardTitle>
            <CardDescription>
              Redemption activity by day of the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyTrends}>
                <defs>
                  <linearGradient
                    id="colorRedemptions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="redemptions"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorRedemptions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Banks */}
        <Card>
          <CardHeader>
            <CardTitle>Top Banks by Redemptions</CardTitle>
            <CardDescription>
              Most popular banks for receiving payouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBanks.map((bank, index) => (
                <div key={bank.bank} className="flex items-center gap-4">
                  <div className="w-8 text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{bank.bank}</span>
                      <span className="text-sm text-muted-foreground">
                        {bank.count.toLocaleString()} ({bank.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${bank.percentage * 4}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voter's Card Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Voter's Card Registration Analysis</CardTitle>
          <CardDescription>
            Breakdown of redeemers with and without voter's cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={votersCardData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {votersCardData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {votersCardData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {item.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {((item.value / totalVotersCard) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
