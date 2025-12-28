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
  Sector,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

const redemptionData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

const geoData = [
  { location: "Rimi", redemptions: 3500 },
  { location: "Daura", redemptions: 2800 },
  { location: "Kankara", redemptions: 2100 },
  { location: "Funtua", redemptions: 2450 },
  { location: "Kafur", redemptions: 1750 },
  { location: "Malumfashi", redemptions: 1920 },
  { location: "Jibia", redemptions: 2640 },
];

const partyData = [
  {
    name: "APC",
    value: 400,
    color: "#6ab04c",
    fullName: "All Progressives Congress",
  },
  {
    name: "PDP",
    value: 300,
    color: "#30336b",
    fullName: "Peoples Democratic Party",
  },
  { name: "LP", value: 250, color: "#e056fd", fullName: "Labour Party" },
  {
    name: "NNPP",
    value: 200,
    color: "#eb4d4b",
    fullName: "New Nigeria Peoples Party",
  },
  {
    name: "APGA",
    value: 150,
    color: "#f0932b",
    fullName: "All Progressives Grand Alliance",
  },
  { name: "Others", value: 100, color: "#bebebe", fullName: "Other Parties" },
];

const totalVoters = partyData.reduce((sum, party) => sum + party.value, 0);

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-5}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        className="text-base font-bold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={15}
        textAnchor="middle"
        fill="hsl(var(--muted-foreground))"
        className="text-xs"
      >
        {value.toLocaleString()} voters
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="hsl(var(--foreground))"
        className="text-sm font-semibold"
      >
        {`${value.toLocaleString()} Voters`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="hsl(var(--muted-foreground))"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(1)}% of total`}
      </text>
    </g>
  );
};

export function RedemptionOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redemption Overview</CardTitle>
        <CardDescription>Total redemptions over the last year.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={redemptionData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="name"
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
              tickFormatter={(value) => `₦${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function GeographicDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Redemptions by Katsina LGAs.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={geoData}>
            <XAxis
              dataKey="location"
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
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar
              dataKey="redemptions"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PartyAffiliationChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const currentParty = partyData[activeIndex];
  const percentage = ((currentParty.value / totalVoters) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Party Affiliation Analysis</CardTitle>
        <CardDescription>
          Distribution of political party preferences among{" "}
          {totalVoters.toLocaleString()} redeemers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Section */}
        <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {partyData.map((party, index) => (
            <div
              key={party.name}
              className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all hover:shadow-md ${
                activeIndex === index
                  ? "border-primary shadow-lg"
                  : "border-border"
              }`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: party.color }}
                />
                <span className="text-xs font-semibold">{party.name}</span>
              </div>
              <div className="text-lg font-bold">
                {party.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {((party.value / totalVoters) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        {/* Active Party Info */}
        <div className="mb-4 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: currentParty.color }}
                />
                <h3 className="text-lg font-semibold">
                  {currentParty.fullName || currentParty.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Hover over or click any party to see details
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {currentParty.value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {percentage}% of voters
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={450} className="mx-auto">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={partyData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={130}
                fill="hsl(var(--primary))"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onClick={(_, index) => setActiveIndex(index)}
              >
                {partyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          <p className="font-semibold">
                            {data.fullName || data.name}
                          </p>
                        </div>
                        <p className="text-sm">
                          <span className="font-bold">
                            {data.value.toLocaleString()}
                          </span>{" "}
                          voters
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((data.value / totalVoters) * 100).toFixed(1)}% of
                          total
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend and Statistics */}
        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-muted-foreground">
              Total Voters Analyzed:
            </span>
            <span className="font-bold">{totalVoters.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Leading Party:</span>
            <span className="font-semibold flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: partyData[0].color }}
              />
              {partyData[0].name} ({partyData[0].value.toLocaleString()} voters)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
