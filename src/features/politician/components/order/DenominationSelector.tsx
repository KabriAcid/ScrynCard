import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard } from "lucide-react";
import { denominations } from "./order-utils";

interface DenominationSelectorProps {
  selected: Set<string>;
  onToggle: (denomId: string) => void;
  errorMessage?: string;
}

export function DenominationSelector({
  selected,
  onToggle,
  errorMessage,
}: DenominationSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Select Card Denominations
        </CardTitle>
        <CardDescription>
          Choose the denominations you want to order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {denominations.map((denom) => {
            const isSelected = selected.has(denom.id);
            const is2k = denom.id === "2000";
            return (
              <button
                key={denom.id}
                type="button"
                onClick={() => onToggle(denom.id)}
                className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-lg font-bold">{denom.label}</div>
                {is2k && (
                  <Badge
                    variant="secondary"
                    className="absolute top-1 right-1 text-xs"
                  >
                    Min 100
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
