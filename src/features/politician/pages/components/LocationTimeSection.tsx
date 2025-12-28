import { MapPin, Globe, Calendar } from "lucide-react";

interface LocationTimeSectionProps {
  location: {
    state: string;
    lga: string;
    ipAddress: string;
    redemptionDate: string;
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

export function LocationTimeSection({ location }: LocationTimeSectionProps) {
  const formattedRedemptionDate = location.redemptionDate
    ? new Date(location.redemptionDate).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "N/A";

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <MapPin className="mr-2 h-5 w-5" /> Location & Time
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoRow icon={MapPin} label="State" value={location.state} />
        <InfoRow
          icon={MapPin}
          label="Local Government Area"
          value={location.lga}
        />
        <InfoRow icon={Globe} label="IP Address" value={location.ipAddress} />
        <InfoRow
          icon={Calendar}
          label="Redemption Time"
          value={formattedRedemptionDate}
        />
      </div>
    </div>
  );
}
