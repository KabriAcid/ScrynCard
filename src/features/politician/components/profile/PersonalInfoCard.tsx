import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Building2, MapPin, Calendar } from "lucide-react";
import type { UserProfile } from "@/lib/mock";
import { format } from "date-fns";

interface PersonalInfoCardProps {
  userProfile: UserProfile;
}

export function PersonalInfoCard({ userProfile }: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Full Name</p>
            <p className="text-sm text-muted-foreground">
              {userProfile.fullName}
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Position</p>
            <p className="text-sm text-muted-foreground">
              {userProfile.position}
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">
              {userProfile.state} State, {userProfile.lga} LGA
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Member Since</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(userProfile.createdAt), "MMMM yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
