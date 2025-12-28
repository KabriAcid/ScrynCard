import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/mock";

interface ContactInfoCardProps {
  userProfile: UserProfile;
}

export function ContactInfoCard({ userProfile }: ContactInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Your contact details and verification status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Email Address</p>
            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
            <Badge variant="outline" className="mt-2 gap-1">
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-4">
          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Phone Number</p>
            <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
            <Badge variant="outline" className="mt-2 gap-1">
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-4">
          <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">KYC Information</p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">BVN:</span>
                <span className="font-mono">
                  *****{userProfile.bvn.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">NIN:</span>
                <span className="font-mono">
                  *****{userProfile.nin.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
