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

const operatorDistributionData = [
  { operator: "MTN", dataRedemptions: 3500, airtimeRedemptions: 2800 },
  { operator: "Airtel", dataRedemptions: 2800, airtimeRedemptions: 2400 },
  { operator: "Glo", dataRedemptions: 2100, airtimeRedemptions: 2200 },
  { operator: "9Mobile", dataRedemptions: 1200, airtimeRedemptions: 1100 },
];

const operatorData = [
  { name: "MTN", value: 450, color: "#FFD700", fullName: "MTN Nigeria" },
  { name: "Airtel", value: 380, color: "#FF0000", fullName: "Airtel Networks" },
  { name: "Glo", value: 320, color: "#00AA00", fullName: "Globacom Limited" },
  { name: "9Mobile", value: 180, color: "#006600", fullName: "9Mobile Networks" },
  { name: "Others", value: 100, color: "#bebebe", fullName: "Other Parties" },
];

const totalOperatorRedemptions = operatorData.reduce((sum, operator) => sum + operator.value, 0);

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

export function OperatorDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operator Distribution</CardTitle>
        <CardDescription>Airtime and data redemptions by mobile operator.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={operatorDistributionData}>
            <XAxis
              dataKey="operator"
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
              dataKey="dataRedemptions"
              name="Data Redemptions"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="airtimeRedemptions"
              name="Airtime Redemptions"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
