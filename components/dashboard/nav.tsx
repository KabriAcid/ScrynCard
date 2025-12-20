"use client";

import { usePathname } from "next/navigation";
import {
  Gift,
  History,
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InstantLink } from "@/components/instant-link";

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    tooltip: "Dashboard",
  },
  {
    href: "/dashboard/redemptions",
    label: "Redemptions",
    icon: Gift,
    tooltip: "Redemptions",
  },
  {
    href: "/dashboard/analysis",
    label: "Analysis",
    icon: BarChart3,
    tooltip: "Analysis",
  },
  {
    href: "/dashboard/fraud-detection",
    label: "Fraud Detection",
    icon: ShieldCheck,
    tooltip: "Fraud Detection",
  },
];

interface DashboardNavProps {
  onNavigate?: () => void;
}

export function DashboardNav({ onNavigate }: DashboardNavProps = {}) {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <InstantLink
          key={item.label}
          href={item.href}
          onClick={() => {
            // Close mobile sheet immediately when clicked
            if (onNavigate) {
              onNavigate();
            }
          }}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            {
              "bg-muted text-primary":
                pathname.startsWith(item.href) &&
                (item.href !== "/dashboard" || pathname === "/dashboard"),
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
