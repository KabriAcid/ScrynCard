import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/dashboard/user-menu";
import { NotificationsMenu } from "@/components/dashboard/notifications-menu";
import { Gift, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export default function CitizenLayout({ children }: CitizenLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
          <button
            onClick={() => navigate("/redeem")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 items-center gap-6 ml-6">
            <button
              onClick={() => navigate("/redeem")}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={() => navigate("/redeem/card")}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Gift className="h-4 w-4" />
              Redeem Card
            </button>
          </nav>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <NotificationsMenu />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.fullName?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Scryn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
