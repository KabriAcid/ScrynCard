import { User, MapPin, Calendar, Mail, CreditCard } from "lucide-react";
import type { Redeemer } from "@/lib/types";

interface RedemptionDetailsContainerProps {
    redeemer: Redeemer;
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
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-medium break-words">{value}</span>
            </div>
        </div>
    );
}

export function RedemptionDetailsContainer({
    redeemer,
}: RedemptionDetailsContainerProps) {
    // Format DOB for display
    const formattedDob = redeemer.personalInfo.dob
        ? new Date(redeemer.personalInfo.dob).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : undefined;

    // Format redemption date
    const formattedRedemptionDate = redeemer.location.redemptionDate
        ? new Date(redeemer.location.redemptionDate).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        : "N/A";

    return (
        <div className="space-y-8">
            {/* Personal Information Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoRow
                        icon={User}
                        label="Full Name"
                        value={redeemer.personalInfo.name}
                    />
                    <InfoRow
                        icon={Mail}
                        label="Email Address"
                        value={redeemer.personalInfo.email}
                    />
                    <InfoRow
                        icon={CreditCard}
                        label="NIN"
                        value={redeemer.personalInfo.nin}
                    />
                    {formattedDob && (
                        <InfoRow icon={Calendar} label="Date of Birth" value={formattedDob} />
                    )}
                </div>
            </div>

            {/* Location & Redemption Time Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location & Redemption Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoRow icon={MapPin} label="State" value={redeemer.location.state} />
                    <InfoRow icon={MapPin} label="LGA" value={redeemer.location.lga} />
                    <InfoRow
                        icon={Calendar}
                        label="Redemption Date"
                        value={formattedRedemptionDate}
                    />
                    <InfoRow
                        icon={MapPin}
                        label="IP Address"
                        value={redeemer.location.ipAddress}
                    />
                </div>
            </div>
        </div>
    );
}
