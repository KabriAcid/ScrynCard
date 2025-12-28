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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  DollarSign,
  Award,
  Star,
} from "lucide-react";

// Mock data for politician analytics
const monthlyCardOrders = [
  { month: "Jan", orders: 12, value: 1200000 },
  { month: "Feb", orders: 18, value: 1800000 },
  { month: "Mar", orders: 25, value: 2500000 },
  { month: "Apr", orders: 22, value: 2200000 },
  { month: "May", orders: 30, value: 3000000 },
  { month: "Jun", orders: 35, value: 3500000 },
  { month: "Jul", orders: 28, value: 2800000 },
  { month: "Aug", orders: 40, value: 4000000 },
  { month: "Sep", orders: 38, value: 3800000 },
  { month: "Oct", orders: 45, value: 4500000 },
  { month: "Nov", orders: 52, value: 5200000 },
  { month: "Dec", orders: 60, value: 6000000 },
];

const politicianTiers = [
  { name: "Platinum", value: 5, color: "#a855f7", minSpend: "₦50M+" },
  { name: "Gold", value: 12, color: "#f59e0b", minSpend: "₦20M-50M" },
  { name: "Silver", value: 28, color: "#94a3b8", minSpend: "₦5M-20M" },
  { name: "Bronze", value: 45, color: "#cd7c32", minSpend: "₦1M-5M" },
  { name: "Starter", value: 110, color: "#6b7280", minSpend: "<₦1M" },
];

const partyDistribution = [
  { name: "APC", value: 85, color: "#6ab04c" },
  { name: "PDP", value: 62, color: "#30336b" },
  { name: "LP", value: 28, color: "#e056fd" },
  { name: "NNPP", value: 15, color: "#eb4d4b" },
  { name: "Others", value: 10, color: "#bebebe" },
];

const engagementMetrics = [
  { metric: "Card Orders", A: 120, fullMark: 150 },
  { metric: "Redemptions", A: 98, fullMark: 150 },
  { metric: "Citizen Reach", A: 86, fullMark: 150 },
  { metric: "Wallet Usage", A: 65, fullMark: 150 },
  { metric: "Platform Activity", A: 85, fullMark: 150 },
  { metric: "Fraud Score", A: 130, fullMark: 150 },
];

const topPoliticians = [
  {
    name: "Dikko Umar Radda",
    party: "APC",
    position: "Governor",
    cardsIssued: 15000,
    totalValue: 75000000,
    avatar: "/img/dikko-radda.png",
  },
  {
    name: "Ibrahim Masari",
    party: "APC",
    position: "Senator",
    cardsIssued: 8500,
    totalValue: 42500000,
    avatar: "",
  },
  {
    name: "Aminu Jaji",
    party: "PDP",
    position: "House Rep",
    cardsIssued: 6200,
    totalValue: 31000000,
    avatar: "",
  },
  {
    name: "Fatima Bello",
    party: "LP",
    position: "House Rep",
    cardsIssued: 4800,
    totalValue: 24000000,
    avatar: "",
  },
  {
    name: "Kabir Yusuf",
    party: "APC",
    position: "Councilor",
    cardsIssued: 3500,
    totalValue: 17500000,
    avatar: "",
  },
];

const totalPoliticians = politicianTiers.reduce((sum, t) => sum + t.value, 0);

export function PoliticiansTab() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Politicians
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoliticians}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8 new this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Politicians
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                78% activity rate
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Card Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦2.4B</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +23% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Cards/Politician
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">385</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Card Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Card Orders</CardTitle>
            <CardDescription>
              Number of card orders placed per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyCardOrders}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#8b5cf6"
                  fill="url(#colorOrders)"
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Politician Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Politician Tiers
            </CardTitle>
            <CardDescription>Distribution by spending tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={politicianTiers}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {politicianTiers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-card p-3 shadow-lg">
                          <p className="font-semibold">{data.name} Tier</p>
                          <p className="text-sm">{data.value} politicians</p>
                          <p className="text-xs text-muted-foreground">
                            Spending: {data.minSpend}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {politicianTiers.map((tier) => (
                <div key={tier.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span className="text-xs">{tier.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Party Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Party Distribution</CardTitle>
            <CardDescription>Politicians by political party</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partyDistribution.map((party) => (
                <div key={party.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="text-sm font-medium">{party.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {party.value} (
                      {((party.value / totalPoliticians) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(party.value / totalPoliticians) * 100}%`,
                        backgroundColor: party.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Engagement</CardTitle>
            <CardDescription>
              Overall politician engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={engagementMetrics}
              >
                <PolarGrid stroke="hsl(var(--muted-foreground))" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Politicians */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Politicians</CardTitle>
          <CardDescription>
            Politicians with highest card issuance and value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPoliticians.map((politician, index) => (
              <div
                key={politician.name}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    #{index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={politician.avatar} />
                    <AvatarFallback>
                      {politician.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{politician.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {politician.party}
                      </Badge>
                      <span>{politician.position}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {politician.cardsIssued.toLocaleString()} cards
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ₦{(politician.totalValue / 1000000).toFixed(1)}M value
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
