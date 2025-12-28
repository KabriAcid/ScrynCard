import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { InstantLink } from "@/components/instant-link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <header className="absolute top-0 left-0 w-full p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Button asChild variant="ghost">
            <InstantLink href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </InstantLink>
          </Button>
        </div>
      </header>
      <main className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
