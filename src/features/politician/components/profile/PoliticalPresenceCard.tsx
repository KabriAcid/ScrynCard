import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Mail, Phone, Award, Users } from "lucide-react";
import type { UserProfile } from "@/lib/mock";

interface PoliticalPresenceCardProps {
  userProfile: UserProfile;
}

export function PoliticalPresenceCard({
  userProfile,
}: PoliticalPresenceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Political Presence & Credentials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Political Position */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Position
            </span>
          </div>
          <div className="ml-7">
            <p className="font-semibold">{userProfile.position}</p>
            <p className="text-sm text-muted-foreground">
              {userProfile.party} Party
            </p>
          </div>
        </div>

        {/* Political Jurisdiction */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Jurisdiction
            </span>
          </div>
          <div className="ml-7">
            <p className="font-semibold">{userProfile.state}</p>
            <p className="text-sm text-muted-foreground">
              LGA: {userProfile.lga}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Contact Details
            </span>
          </div>
          <div className="ml-7 space-y-2">
            <a
              href={`mailto:${userProfile.email}`}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors no-underline text-foreground"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              {userProfile.email}
            </a>
            <a
              href={`tel:${userProfile.phone}`}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors no-underline text-foreground"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              {userProfile.phone}
            </a>
          </div>
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
          </div>
          <div className="ml-7">
            <Badge variant={userProfile.verified ? "default" : "secondary"}>
              {userProfile.verified
                ? "Verified Political Figure"
                : "Pending Verification"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
