import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  LoaderCircle,
  Mail,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" className="h-12 w-full rounded-xl text-sm font-semibold shadow-sm" disabled={isLoading}>
      {isLoading ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Signing In...
        </>
      ) : (
        <>
          Sign In <ArrowRight className="ml-2" />
        </>
      )}
    </Button>
  );
}

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      // Auto-login without auth validation
      await login(email, password);

      // Get user from store and navigate
      const user = useAuthStore.getState().user;

      if (user) {
        toast({
          title: "Success",
          description: "You have been logged in",
        });

        // Auto-redirect based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "politician") {
          navigate("/politician");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
      <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[13px] font-semibold text-[#34443a]">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#89958c]" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-12 rounded-xl border-[#e2e7e2] bg-[#fbfcfb] pl-11 text-sm shadow-none placeholder:text-[#a0aaa2] focus-visible:border-[#6b8b73] focus-visible:ring-[#6b8b73]/15"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[13px] font-semibold text-[#34443a]">Password</Label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#89958c]" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="h-12 rounded-xl border-[#e2e7e2] bg-[#fbfcfb] pl-11 text-sm shadow-none placeholder:text-[#a0aaa2] focus-visible:border-[#6b8b73] focus-visible:ring-[#6b8b73]/15"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      <SubmitButton isLoading={isLoading} />
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/order")}
          className="font-semibold text-[#46624f] transition-colors hover:text-[#263e2e] hover:underline"
        >
          Create an order
        </button>
      </div>
    </form>
  );
}
