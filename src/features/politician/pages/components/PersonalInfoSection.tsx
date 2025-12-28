import { User, Mail, Phone, CreditCard } from "lucide-react";

interface PersonalInfoSectionProps {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    nin: string;
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
          value={`****-****-${personalInfo.nin.slice(-4)}`}
        />
      </div>
    </div>
  );
}
