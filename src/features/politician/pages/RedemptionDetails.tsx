import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
  PersonalInfoSection,
  BankDetailsSection,
  LocationTimeSection,
  RedemptionDetailsSkeleton,
} from "./components";

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

export default function RedemptionDetailsPage() {
  const { id } = useParams();
  const [redeemer, setRedeemer] = useState<Redeemer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchRedemption = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Try to find by exact ID match first
      let foundRedeemer = redeemers.find((r) => r.id === id);

      // If not found, generate mock data based on the order ID
      if (!foundRedeemer && id) {
        // Generate mock redeemer data for any order ID
        const mockNames = [
          "Aisha Bello",
          "Chinedu Okoro",
          "Fatima Garba",
          "Yusuf Ahmed",
          "Ngozi Eze",
        ];
        const mockBanks = [
          "Zenith Bank",
          "GTBank",
          "First Bank",
          "UBA",
          "Access Bank",
        ];
        const mockStates = ["Lagos", "Kano", "Abuja (FCT)", "Oyo", "Rivers"];
        const mockLGAs = [
          "Ikeja",
          "Kano Municipal",
          "Abuja Municipal",
          "Ibadan North",
          "Port Harcourt",
        ];

        const index = parseInt(id.split("-")[1] || "0") % 5;

        foundRedeemer = {
          id,
          personalInfo: {
            name: mockNames[index],
            email: `${mockNames[index]
              .toLowerCase()
              .replace(" ", ".")}@example.com`,
            phone: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
            nin: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
          },
          bankDetails: {
            accountNumber: `${Math.floor(
              1000000000 + Math.random() * 9000000000
            )}`,
            bankName: mockBanks[index],
            bvn: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
          },
          location: {
            state: mockStates[index],
            lga: mockLGAs[index],
            ipAddress: `${Math.floor(100 + Math.random() * 155)}.${Math.floor(
              1 + Math.random() * 254
            )}.${Math.floor(1 + Math.random() * 254)}.${Math.floor(
              1 + Math.random() * 254
            )}`,
            redemptionDate: new Date(
              Date.now() - Math.random() * 10000000000
            ).toISOString(),
          },
        };
      }

      setRedeemer(foundRedeemer || null);
      setIsLoading(false);
      setHasLoaded(true);
    };

    fetchRedemption();
  }, [id]);

  if (isLoading || !hasLoaded) {
    return <RedemptionDetailsSkeleton />;
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redemption Details</CardTitle>
        <CardDescription>
          Detailed information for this redemption record.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <PersonalInfoSection personalInfo={redeemer.personalInfo} />
        <Separator />
        <BankDetailsSection bankDetails={redeemer.bankDetails} />
        <Separator />
        <LocationTimeSection location={redeemer.location} />
      </CardContent>
    </Card>
  );
}
