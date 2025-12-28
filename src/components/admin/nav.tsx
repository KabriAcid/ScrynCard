import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Gift,
  ShieldAlert,
  Megaphone,
  CreditCard,
  UserCheck,
  BarChart3,
  Settings,
  Bell,
  Activity,
} from "lucide-react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    tooltip: "Dashboard Overview",
  },
  {
    href: "/admin/politicians",
    label: "Politicians",
    icon: Users,
    tooltip: "Manage Politicians",
  },
  {
    href: "/admin/redemptions",
    label: "Redemptions",
    icon: Gift,
    tooltip: "All Redemptions",
  },
  {
    href: "/admin/fraud",
    label: "Fraud & Risk",
    icon: ShieldAlert,
    tooltip: "Fraud Detection",
  },
  {
    href: "/admin/campaigns",
    label: "Campaigns",
    icon: Megaphone,
    tooltip: "Campaign Management",
  },
  {
    href: "/admin/cards",
    label: "Cards",
    icon: CreditCard,
    tooltip: "Card Batches",
  },
  {
    href: "/admin/citizens",
    label: "Citizens",
    icon: UserCheck,
    tooltip: "Citizens Directory",
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    tooltip: "Platform Analytics",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    tooltip: "Admin Settings",
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
    tooltip: "Notification Center",
  },
  {
    href: "/admin/activity-log",
    label: "Activity Log",
    icon: Activity,
    tooltip: "Platform Activity Log",
  },
];

interface AdminNavProps {
  onNavigate?: () => void;
}

export function AdminNav({ onNavigate }: AdminNavProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          onClick={() => {
            navigate(item.href);
            if (onNavigate) {
              onNavigate();
            }
          }}
          className={cn(
            "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary w-full",
            {
              "bg-muted text-primary":
                location.pathname.startsWith(item.href) &&
                (item.href !== "/admin" || location.pathname === "/admin"),
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
