"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  LoaderCircle,
  Mail,
  KeyRound,
} from "lucide-react";
import { InstantLink } from "@/components/instant-link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/login/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";

function SubmitButton({
  setIsLoading,
}: {
  setIsLoading: (isLoading: boolean) => void;
}) {
  const { pending } = useFormStatus();

  useEffect(() => {
    setIsLoading(pending);
  }, [pending, setIsLoading]);

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      Sign In <ArrowRight />
    </Button>
  );
}

const initialState = {
  message: "",
  status: "idle" as "idle" | "success" | "error",
};

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state?.status === "error" && state.message) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <>
      {isLoading && <Loading />}
      <form action={formAction} className="space-y-6">
        {state?.status === "error" && state.message && (
          <Alert variant={"destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="pl-10"
            />
          </div>
        </div>
        <SubmitButton setIsLoading={setIsLoading} />
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <InstantLink
            href="/order"
            className="font-semibold text-primary hover:underline"
          >
            Create an order
          </InstantLink>
        </div>
      </form>
    </>
  );
}
