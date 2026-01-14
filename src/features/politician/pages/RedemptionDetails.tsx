import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockRedemptions } from "@/lib/mock";
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

      // Find the redemption from mockRedemptions
      const redemption = mockRedemptions.find((r) => r.id === id);

      if (redemption) {
        // Transform mockRedemption to Redeemer format
        // Using available data from the redemption structure
        const foundRedeemer: Redeemer = {
          id: redemption.id,
          personalInfo: {
            name: "Citizen User",
            email: "citizen@example.com",
            phone: redemption.phoneNumber || "N/A",
            nin: "12345678901234",
            dob: "1990-01-15",
            favoriteParty: "APC",
            hasVotersCard: true,
          },
          bankDetails: {
            accountNumber: "1234567890",
            bankName: "First Bank Nigeria",
            bvn: "12345678901",
          },
          location: {
            state: "Lagos",
            lga: "Lagos Island",
            ipAddress: "192.168.1.1",
            redemptionDate: redemption.completedAt || redemption.createdAt,
          },
        };
        setRedeemer(foundRedeemer);
      } else {
        setRedeemer(null);
      }

      setHasLoaded(true);
      setIsLoading(false);
    };

    if (id) {
      fetchRedemption();
    }
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
