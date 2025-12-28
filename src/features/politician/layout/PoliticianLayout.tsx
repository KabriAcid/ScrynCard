import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { DashboardNav } from "@/components/dashboard/nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { NotificationsMenu } from "@/components/dashboard/notifications-menu";
import { SearchCommand } from "@/components/dashboard/search-command";
import { User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function PoliticianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen w-full">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-card md:fixed md:left-0 md:top-0 md:h-screen md:w-[220px] lg:w-[280px] md:block z-40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto">
            <DashboardNav />
          </div>
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="/img/dikko-radda.png"
                  alt="Dikko Umar Radda"
                />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {user?.fullName || "Governor"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:pl-[220px] lg:pl-[280px]">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm bg-card/95 sticky top-0 z-50">
          {/* Mobile Nav */}
          <MobileNav />
          <div className="w-full flex-1">
            <SearchCommand />
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Menu */}
            <NotificationsMenu />
            {/* User Menu */}
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
