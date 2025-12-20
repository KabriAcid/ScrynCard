import { Logo } from "@/components/logo";
import { CardRedemptionForm } from "@/components/forms/card-redemption-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RedeemPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-blue-800/30 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Logo />
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="hover:bg-blue-900/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center p-4 pt-24 pb-10">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">
              Redeem Your Card
            </h1>
            <p className="text-blue-200 text-lg">
              Complete the process in two simple steps
            </p>
          </div>
          <CardRedemptionForm />
        </div>
      </main>
    </div>
  );
}
