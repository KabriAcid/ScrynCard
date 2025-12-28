import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { AdminNav } from "./nav";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex items-center border-b pb-4">
          <Logo />
        </div>
        <div className="flex-1 overflow-auto py-4">
          <AdminNav onNavigate={() => setOpen(false)} />
        </div>
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Admin Portal
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
