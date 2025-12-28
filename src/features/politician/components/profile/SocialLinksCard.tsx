import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import type { UserProfile } from "@/lib/mock";

interface SocialLinksCardProps {
  userProfile: UserProfile;
}

export function SocialLinksCard({ userProfile }: SocialLinksCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social & Web</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userProfile.website && (
          <>
            <a
              href={userProfile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors no-underline text-foreground"
            >
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span>{userProfile.website}</span>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </a>
            <Separator />
          </>
        )}
        {userProfile.socialMedia?.twitter && (
          <>
            <a
              href={`https://twitter.com/${userProfile.socialMedia.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors no-underline text-foreground"
            >
              <Twitter className="h-5 w-5 text-muted-foreground" />
              <span>{userProfile.socialMedia.twitter}</span>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </a>
            <Separator />
          </>
        )}
        {userProfile.socialMedia?.facebook && (
          <>
            <a
              href={`https://facebook.com/${userProfile.socialMedia.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors no-underline text-foreground"
            >
              <Facebook className="h-5 w-5 text-muted-foreground" />
              <span>{userProfile.socialMedia.facebook}</span>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </a>
            <Separator />
          </>
        )}
        {userProfile.socialMedia?.instagram && (
          <>
            <a
              href={`https://instagram.com/${userProfile.socialMedia.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors no-underline text-foreground"
            >
              <Instagram className="h-5 w-5 text-muted-foreground" />
              <span>@{userProfile.socialMedia.instagram}</span>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </a>
            <Separator />
          </>
        )}
        {userProfile.socialMedia?.linkedin && (
          <a
            href={`https://linkedin.com/in/${userProfile.socialMedia.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm hover:text-primary transition-colors no-underline text-foreground"
          >
            <Linkedin className="h-5 w-5 text-muted-foreground" />
            <span>{userProfile.socialMedia.linkedin}</span>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
