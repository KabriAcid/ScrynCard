"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { DashboardNav } from "@/components/dashboard/nav";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <DashboardNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
