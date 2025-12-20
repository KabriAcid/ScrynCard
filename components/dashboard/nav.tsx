import { useLocation } from "react-router-dom";
import {
  Gift,
  History,
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems: NavItem[] = [
  {
    href: "/politician",
    label: "Dashboard",
    icon: LayoutDashboard,
    tooltip: "Dashboard",
  },
  {
    href: "/politician/redemption",
    label: "Redemptions",
    icon: Gift,
    tooltip: "Redemptions",
  },
  {
    href: "/politician/analytics",
    label: "Analytics",
    icon: BarChart3,
    tooltip: "Analytics",
  },
  {
    href: "/politician/fraud-detection",
    label: "Fraud Detection",
    icon: ShieldCheck,
    tooltip: "Fraud Detection",
  },
];

interface DashboardNavProps {
  onNavigate?: () => void;
}

export function DashboardNav({ onNavigate }: DashboardNavProps = {}) {
  const location = useLocation();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          onClick={() => {
            // Close mobile sheet immediately when clicked
            if (onNavigate) {
              onNavigate();
            }
            // Navigate to the item (would be handled by parent route)
          }}
          className={cn(
            "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary w-full",
            {
              "bg-muted text-primary":
                location.pathname.startsWith(item.href) &&
                (item.href !== "/politician" || location.pathname === "/politician"),
            }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
