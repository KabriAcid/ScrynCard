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
  LineChart,
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
  Users,
  UserCheck,
  UserX,
  MapPin,
  Shield,
} from "lucide-react";

// Mock data for citizen analytics
const registrationTrends = [
  { month: "Jan", registered: 450, verified: 380 },
  { month: "Feb", registered: 520, verified: 440 },
  { month: "Mar", registered: 680, verified: 590 },
  { month: "Apr", registered: 720, verified: 650 },
  { month: "May", registered: 890, verified: 780 },
  { month: "Jun", registered: 1020, verified: 920 },
  { month: "Jul", registered: 1150, verified: 1040 },
  { month: "Aug", registered: 980, verified: 890 },
  { month: "Sep", registered: 1100, verified: 1010 },
  { month: "Oct", registered: 1280, verified: 1180 },
  { month: "Nov", registered: 1450, verified: 1350 },
  { month: "Dec", registered: 1580, verified: 1480 },
];

const verificationStatus = [
  { name: "Verified", value: 8500, color: "#22c55e" },
  { name: "Pending", value: 1500, color: "#f59e0b" },
  { name: "Rejected", value: 200, color: "#ef4444" },
];

const kycStatus = [
  { name: "Full KYC", value: 6200, color: "#3b82f6" },
  { name: "Partial KYC", value: 2800, color: "#8b5cf6" },
  { name: "No KYC", value: 1200, color: "#94a3b8" },
];

const ageDistribution = [
  { age: "18-24", count: 2100 },
  { age: "25-34", count: 3800 },
  { age: "35-44", count: 2500 },
  { age: "45-54", count: 1200 },
  { age: "55-64", count: 480 },
  { age: "65+", count: 120 },
];

const lgaDistribution = [
  { lga: "Katsina", citizens: 1850 },
  { lga: "Daura", citizens: 1420 },
  { lga: "Funtua", citizens: 1180 },
  { lga: "Malumfashi", citizens: 980 },
  { lga: "Kankara", citizens: 890 },
  { lga: "Jibia", citizens: 780 },
  { lga: "Others", citizens: 3100 },
];

const dailyActivity = [
  { date: "Dec 22", logins: 320, redemptions: 180 },
  { date: "Dec 23", logins: 450, redemptions: 220 },
  { date: "Dec 24", logins: 380, redemptions: 190 },
  { date: "Dec 25", logins: 250, redemptions: 120 },
  { date: "Dec 26", logins: 520, redemptions: 280 },
  { date: "Dec 27", logins: 480, redemptions: 260 },
  { date: "Dec 28", logins: 410, redemptions: 210 },
];

const totalCitizens = verificationStatus.reduce((sum, s) => sum + s.value, 0);

export function CitizensTab() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Citizens
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCitizens.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +18.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,500</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                83.3% verification rate
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <UserX className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,500</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Average wait: 2.3 days
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full KYC</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +5.4% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Registration Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Registration & Verification Trends</CardTitle>
            <CardDescription>
              Monthly citizen registrations and verifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={registrationTrends}>
                <defs>
                  <linearGradient
                    id="colorRegistered"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorVerified"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="registered"
                  stroke="#3b82f6"
                  fill="url(#colorRegistered)"
                  name="Registered"
                />
                <Area
                  type="monotone"
                  dataKey="verified"
                  stroke="#22c55e"
                  fill="url(#colorVerified)"
                  name="Verified"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>
              Current verification status of all citizens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={verificationStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {verificationStatus.map((entry, index) => (
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
                            {data.value.toLocaleString()} citizens
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {((data.value / totalCitizens) * 100).toFixed(1)}%
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
              {verificationStatus.map((status) => (
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
        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>
              Breakdown of citizens by age group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageDistribution}>
                <XAxis
                  dataKey="age"
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
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Citizens"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* KYC Status */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Completion Levels</CardTitle>
            <CardDescription>
              Citizens by KYC verification level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kycStatus.map((status) => (
                <div key={status.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm font-medium">{status.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {status.value.toLocaleString()} (
                      {((status.value / totalCitizens) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(status.value / totalCitizens) * 100}%`,
                        backgroundColor: status.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LGA Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Citizens by Local Government Area</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={lgaDistribution} layout="vertical">
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="lga"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Bar
                  dataKey="citizens"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  name="Citizens"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
            <CardDescription>
              Login and redemption activity trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyActivity}>
                <XAxis
                  dataKey="date"
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
                <Line
                  type="monotone"
                  dataKey="logins"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                  name="Logins"
                />
                <Line
                  type="monotone"
                  dataKey="redemptions"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e" }}
                  name="Redemptions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
