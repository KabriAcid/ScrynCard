"use client";

import { usePathname } from "next/navigation";
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
} from "lucide-react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InstantLink } from "@/components/instant-link";

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
];

interface AdminNavProps {
  onNavigate?: () => void;
}

export function AdminNav({ onNavigate }: AdminNavProps = {}) {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <InstantLink
          key={item.label}
          href={item.href}
          onClick={() => {
            if (onNavigate) {
              onNavigate();
            }
          }}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            {
              "bg-muted text-primary":
                pathname.startsWith(item.href) &&
                (item.href !== "/admin" || pathname === "/admin"),
            }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </InstantLink>
      ))}
    </nav>
  );
}
