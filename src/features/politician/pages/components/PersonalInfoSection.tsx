import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Flag,
  Vote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PersonalInfoSectionProps {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    nin: string;
    dob?: string;
    favoriteParty?: string;
    hasVotersCard?: boolean;
  };
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start">
      <Icon className="h-5 w-5 text-muted-foreground mr-4 mt-1" />
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}

export function PersonalInfoSection({
  personalInfo,
}: PersonalInfoSectionProps) {
  // Format DOB for display
  const formattedDob = personalInfo.dob
    ? new Date(personalInfo.dob).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <User className="mr-2 h-5 w-5" /> Personal Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoRow icon={User} label="Full Name" value={personalInfo.name} />
        <InfoRow icon={Mail} label="Email Address" value={personalInfo.email} />
        <InfoRow icon={Phone} label="Phone Number" value={personalInfo.phone} />
        <InfoRow
          icon={CreditCard}
          label="National ID (NIN)"
          value={
            personalInfo.nin
              ? `****-****-${personalInfo.nin.slice(-4)}`
              : undefined
          }
        />
        <InfoRow icon={Calendar} label="Date of Birth" value={formattedDob} />
        <InfoRow
          icon={Flag}
          label="Favorite Party"
          value={personalInfo.favoriteParty}
        />
        {/* Voter's Card Status */}
        {personalInfo.hasVotersCard !== undefined && (
          <div className="flex items-start">
            <Vote className="h-5 w-5 text-muted-foreground mr-4 mt-1" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Voter's Card
              </span>
              <Badge
                variant={personalInfo.hasVotersCard ? "default" : "secondary"}
                className={
                  personalInfo.hasVotersCard
                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 w-fit"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 w-fit"
                }
              >
                {personalInfo.hasVotersCard
                  ? "Has Voter's Card"
                  : "No Voter's Card"}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
