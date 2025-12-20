import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { DashboardNav } from "@/components/dashboard/nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { NotificationsMenu } from "@/components/dashboard/notifications-menu";
import { SearchCommand } from "@/components/dashboard/search-command";
import { User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar - Server Component */}
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1">
            <DashboardNav />
          </div>
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">Hon. Adebayo</span>
                <span className="text-sm text-muted-foreground">ACN Party</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm bg-card/95 sticky top-0 z-50">
          {/* Mobile Nav - Client Component */}
          <MobileNav />
          <div className="w-full flex-1">
            <SearchCommand />
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Menu - Client Component */}
            <NotificationsMenu />
            {/* User Menu - Client Component */}
            <UserMenu />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background/80">
          {children}
        </main>
      </div>
    </div>
  );
}
