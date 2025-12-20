import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Redeemer } from "@/lib/types";
import {
  Banknote,
  Calendar,
  CreditCard,
  Landmark,
  Mail,
  MapPin,
  Phone,
  User,
  Globe,
} from "lucide-react";

// Mock data - in a real app, you would fetch this based on the ID
const redeemers: Redeemer[] = [
  {
    id: "RED-001",
    personalInfo: {
      name: "Aisha Bello",
      email: "aisha.b@example.com",
      phone: "08012345678",
      nin: "11122233344",
    },
    bankDetails: {
      accountNumber: "0123456789",
      bankName: "Zenith Bank",
      bvn: "22233344455",
    },
    location: {
      state: "Kano",
      lga: "Kano Municipal",
      ipAddress: "197.210.70.11",
      redemptionDate: "2024-03-20T10:05:15Z",
    },
  },
  {
    id: "RED-002",
    personalInfo: {
      name: "Chinedu Okoro",
      email: "chinedu.o@example.com",
      phone: "09087654321",
      nin: "55566677788",
    },
    bankDetails: {
      accountNumber: "9876543210",
      bankName: "GTBank",
      bvn: "88877766655",
    },
    location: {
      state: "Lagos",
      lga: "Ikeja",
      ipAddress: "102.89.43.1",
      redemptionDate: "2024-03-21T11:30:00Z",
    },
  },
  {
    id: "RED-003",
    personalInfo: {
      name: "Fatima Garba",
      email: "fatima.g@example.com",
      phone: "07011223344",
      nin: "99988877766",
    },
    bankDetails: {
      accountNumber: "1122334455",
      bankName: "First Bank",
      bvn: "66655544433",
    },
    location: {
      state: "Abuja (FCT)",
      lga: "Abuja Municipal",
      ipAddress: "41.190.2.10",
      redemptionDate: "2024-03-22T09:15:45Z",
    },
  },
  {
    id: "RED-004",
    personalInfo: {
      name: "Yusuf Ahmed",
      email: "yusuf.a@example.com",
      phone: "08122334455",
      nin: "12345678901",
    },
    bankDetails: {
      accountNumber: "2345678901",
      bankName: "UBA",
      bvn: "10987654321",
    },
    location: {
      state: "Oyo",
      lga: "Ibadan North",
      ipAddress: "196.46.244.10",
      redemptionDate: "2024-03-23T15:00:22Z",
    },
  },
  {
    id: "RED-005",
    personalInfo: {
      name: "Ngozi Eze",
      email: "ngozi.e@example.com",
      phone: "09099887766",
      nin: "23456789012",
    },
    bankDetails: {
      accountNumber: "3456789012",
      bankName: "Access Bank",
      bvn: "21098765432",
    },
    location: {
      state: "Rivers",
      lga: "Port Harcourt",
      ipAddress: "154.113.1.5",
      redemptionDate: "2024-03-24T18:45:10Z",
    },
  },
];

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

export default function RedemptionDetailsPage() {
  const { id } = useParams();
  const redeemer = redeemers.find((r) => r.id === id);

  if (!redeemer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Redemption Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The redemption record you're looking for does not exist.</p>
        </CardContent>
      </Card>
    );
  }

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
    <Card>
      <CardHeader>
        <CardTitle>Redemption Details</CardTitle>
        <CardDescription>
          Detailed information for this redemption record.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" /> Personal Information
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
              icon={Phone}
              label="Phone Number"
              value={redeemer.personalInfo.phone}
            />
            <InfoRow
              icon={CreditCard}
              label="National ID (NIN)"
              value={`****-****-${redeemer.personalInfo.nin.slice(-4)}`}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Landmark className="mr-2 h-5 w-5" /> Bank Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoRow
              icon={Landmark}
              label="Bank Name"
              value={redeemer.bankDetails.bankName}
            />
            <InfoRow
              icon={Banknote}
              label="Account Number"
              value={`******${redeemer.bankDetails.accountNumber.slice(-4)}`}
            />
            <InfoRow
              icon={CreditCard}
              label="BVN"
              value={`****-****-${redeemer.bankDetails.bvn.slice(-4)}`}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Location & Time
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoRow
              icon={MapPin}
              label="State"
              value={redeemer.location.state}
            />
            <InfoRow
              icon={MapPin}
              label="Local Government Area"
              value={redeemer.location.lga}
            />
            <InfoRow
              icon={Globe}
              label="IP Address"
              value={redeemer.location.ipAddress}
            />
            <InfoRow
              icon={Calendar}
              label="Redemption Time"
              value={formattedRedemptionDate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
