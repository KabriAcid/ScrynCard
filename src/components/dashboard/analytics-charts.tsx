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
  {
    name: "9Mobile",
    value: 180,
    color: "#006600",
    fullName: "9Mobile Networks",
  },
  { name: "Others", value: 100, color: "#bebebe", fullName: "Other Parties" },
];

const totalOperatorRedemptions = operatorData.reduce(
  (sum, operator) => sum + operator.value,
  0
);

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
          <BarChart data={redemptionData}>
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
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
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
        <CardDescription>
          Airtime and data redemptions by mobile operator.
        </CardDescription>
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

const beneficiaryDistributionData = [
  { name: "Teachers", value: 1200, color: "#3B82F6", fullName: "Teachers" },
  {
    name: "Healthcare Workers",
    value: 950,
    color: "#10B981",
    fullName: "Healthcare Workers",
  },
  { name: "Students", value: 1800, color: "#F59E0B", fullName: "Students" },
  {
    name: "Business Owners",
    value: 650,
    color: "#8B5CF6",
    fullName: "Small Business Owners",
  },
  {
    name: "Others",
    value: 400,
    color: "#6B7280",
    fullName: "Other Beneficiaries",
  },
];

const totalBeneficiaries = beneficiaryDistributionData.reduce(
  (sum, beneficiary) => sum + beneficiary.value,
  0
);

export function BeneficiaryDistributionChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const currentBeneficiary = beneficiaryDistributionData[activeIndex];
  const percentage = (
    (currentBeneficiary.value / totalBeneficiaries) *
    100
  ).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beneficiary Distribution</CardTitle>
        <CardDescription>
          Distribution of airtime and data across beneficiary groups (
          {totalBeneficiaries.toLocaleString()} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Section */}
        <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {beneficiaryDistributionData.map((beneficiary, index) => (
            <div
              key={beneficiary.name}
              className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all hover:shadow-md ${activeIndex === index
                  ? "border-primary shadow-lg"
                  : "border-border"
                }`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: beneficiary.color }}
                />
                <span className="text-xs font-semibold">
                  {beneficiary.name}
                </span>
              </div>
              <div className="text-lg font-bold">
                {beneficiary.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {((beneficiary.value / totalBeneficiaries) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        {/* Active Beneficiary Info */}
        <div className="mb-4 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: currentBeneficiary.color }}
                />
                <h3 className="text-lg font-semibold">
                  {currentBeneficiary.fullName || currentBeneficiary.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Hover over or click any category to see details
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {currentBeneficiary.value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {percentage}% of beneficiaries
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
                data={beneficiaryDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={130}
                fill="hsl(var(--primary))"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onClick={(_, index) => setActiveIndex(index)}
              >
                {beneficiaryDistributionData.map((entry, index) => (
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
                          beneficiaries
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((data.value / totalBeneficiaries) * 100).toFixed(1)}
                          % of total
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
            <span className="text-muted-foreground">Total Beneficiaries:</span>
            <span className="font-bold">
              {totalBeneficiaries.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Largest Group:</span>
            <span className="font-semibold flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: beneficiaryDistributionData[0].color,
                }}
              />
              {beneficiaryDistributionData[0].name} (
              {beneficiaryDistributionData[0].value.toLocaleString()}{" "}
              beneficiaries)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
