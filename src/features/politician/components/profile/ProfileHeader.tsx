import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Edit, Shield } from "lucide-react";
import type { UserProfile } from "@/lib/mock";

interface ProfileHeaderProps {
  userProfile: UserProfile;
  onEditClick: () => void;
}

export function ProfileHeader({
  userProfile,
  onEditClick,
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(userProfile.fullName);

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Cover Image */}
        <div
          className="h-48 w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background bg-cover bg-center"
          style={{
            backgroundImage: userProfile.coverImage
              ? `url(${userProfile.coverImage})`
              : undefined,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Avatar & Basic Info */}
        <CardContent className="relative pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage
                  src="/img/dikko-radda.png"
                  alt={userProfile.fullName}
                />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg"
                onClick={onEditClick}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* Name & Title */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold">{userProfile.fullName}</h2>
                <Badge variant="secondary" className="text-sm">
                  {userProfile.party}
                </Badge>
                {userProfile.verified && (
                  <Badge variant="default" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground">
                {userProfile.position}
              </p>
              <p className="text-sm text-muted-foreground">
                {userProfile.state} State • {userProfile.lga} LGA
              </p>
            </div>

            {/* Edit Button */}
            <Button onClick={onEditClick} size="lg">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
