import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockRedemptions } from "@/lib/mock";
import { ArrowLeft, Check, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Redeemer } from "@/lib/types";
import {
  PersonalInfoSection,
  BankDetailsSection,
  LocationTimeSection,
  RedemptionDetailsSkeleton,
} from "./components";

export default function RedemptionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [redemption, setRedemption] = useState<any>(null);
  const [redeemer, setRedeemer] = useState<Redeemer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchRedemption = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the redemption from mockRedemptions
      const foundRedemption = mockRedemptions.find((r) => r.id === id);

      if (foundRedemption) {
        setRedemption(foundRedemption);
        // Transform mockRedemption to Redeemer format
        // Using available data from the redemption structure
        const foundRedeemer: Redeemer = {
          id: foundRedemption.id,
          personalInfo: {
            name: "Citizen User",
            email: "citizen@example.com",
            phone: foundRedemption.phoneNumber || "N/A",
            nin: "12345678901234",
            dob: "1990-01-15",
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
            redemptionDate: foundRedemption.completedAt || foundRedemption.createdAt,
          },
        };
        setRedeemer(foundRedeemer);
      } else {
        setRedemption(null);
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
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/politician/redemption")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Redemptions
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Redemption Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The redemption record you're looking for does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/politician/redemption")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Redemptions
      </Button>

      {/* Header Card with Status */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Redemption Details</CardTitle>
              <CardDescription className="mt-2">
                Detailed information for this redemption record
              </CardDescription>
            </div>
            <Badge variant={redemption?.status === "completed" ? "default" : "secondary"} className="h-fit">
              {redemption?.status === "completed" && <Check className="mr-2 h-4 w-4" />}
              {redemption?.status === "processing" && <Clock className="mr-2 h-4 w-4" />}
              {redemption?.status === "completed" ? "Completed" : "Processing"}
            </Badge>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Redemption ID</p>
              <p className="font-mono text-sm font-medium">{redemption?.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone Number</p>
              <p className="font-medium">{redemption?.phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Operator</p>
              <p className="font-medium">{redemption?.mobileOperator}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gift Type</p>
              <Badge variant="outline" className="capitalize">
                {redemption?.giftType}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Information */}
      <Card>
        <CardContent className="space-y-8 pt-6">
          <PersonalInfoSection personalInfo={redeemer.personalInfo} />
          <Separator />
          <BankDetailsSection bankDetails={redeemer.bankDetails} />
          <Separator />
          <LocationTimeSection location={redeemer.location} />
        </CardContent>
      </Card>
    </div>
  );
}
