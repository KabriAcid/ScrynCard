import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Settings,
  HelpCircle,
  Shield,
  CreditCard,
  Moon,
  Sun,
} from "lucide-react";
import { InstantLink } from "@/components/instant-link";
import { useAuthStore } from "@/stores/authStore";
import { getUserProfileByEmail, getDemoUserProfile } from "@/lib/mock";
import type { UserProfile } from "@/lib/mock";
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

export function UserMenu() {
  const { user } = useAuthStore();

  // Get user profile data - fallback to demo if not found
  const userProfile: UserProfile = user?.email
    ? getUserProfileByEmail(user.email) || getDemoUserProfile()
    : getDemoUserProfile();

  // Extract initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userProfile.fullName || user?.fullName || "User";
  const displayEmail = userProfile.email || user?.email || "user@example.com";
  const displayParty = userProfile.party || "N/A";
  const avatar = userProfile.avatar;
  const initials = getInitials(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-offset-2 ring-primary/10 hover:ring-primary/30 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <Badge variant="secondary" className="text-xs">
                {displayParty}
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
              to="/politician/profile"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </InstantLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <InstantLink
              to="/politician/billing"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <Badge variant="outline" className="ml-auto text-xs">
                Pro
              </Badge>
            </InstantLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <InstantLink
              to="/politician/settings"
              className="cursor-pointer w-full flex items-center no-underline text-foreground"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
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
          <DropdownMenuItem>
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy & Security</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <InstantLink
            to="/login"
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
