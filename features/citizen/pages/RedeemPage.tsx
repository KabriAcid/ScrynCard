import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { CardRedemptionForm } from "@/features/citizen/components/card-redemption-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RedeemPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <header className="absolute top-0 left-0 w-full p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="w-full max-w-2xl mt-20">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Redeem Your Card</CardTitle>
            <CardDescription>
              Complete the process in two simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardRedemptionForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
