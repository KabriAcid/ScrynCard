import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Settings,
  HelpCircle,
  Shield,
  Users,
  Moon,
  Sun,
  Bell,
  Activity,
} from "lucide-react";
import { InstantLink } from "@/components/instant-link";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function AdminUserMenu() {
  const { user } = useAuthStore();

  // Extract initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.fullName || "Admin User";
  const displayEmail = user?.email || "admin@scryncard.com";
  const initials = getInitials(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-offset-2 ring-primary/10 hover:ring-primary/30 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle admin menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <Badge variant="default" className="text-xs gap-1">
                <Shield className="h-3 w-3" />
                Super Admin
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <InstantLink
              to="/admin/profile"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Admin Profile</span>
            </InstantLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <InstantLink
              to="/admin/settings"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </InstantLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <InstantLink
              to="/admin/analytics"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <Activity className="mr-2 h-4 w-4" />
              <span>Platform Analytics</span>
            </InstantLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <InstantLink
              to="/admin/politicians"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Manage Politicians</span>
            </InstantLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <InstantLink
              to="/admin/fraud"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Fraud Center</span>
            </InstantLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <InstantLink
            to="/admin/login"
            className="cursor-pointer w-full flex items-center no-underline text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </InstantLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
