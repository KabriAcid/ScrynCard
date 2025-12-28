import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DetailsForm } from "@/components/details-form";

export default function RedeemDetailsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <main className="w-full max-w-2xl">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Almost there!</CardTitle>
            <CardDescription>
              Please provide your details to complete the redemption.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <DetailsForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
