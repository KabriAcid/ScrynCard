import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  className?: string;
}

export function KPICard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  className,
}: KPICardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              "text-xs",
              trend === "up" ? "text-green-600" : "text-red-600"
            )}
          >
            {trend === "up" ? "+" : "-"}
            {change} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
