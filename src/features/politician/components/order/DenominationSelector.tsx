import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Wifi, Smartphone } from "lucide-react";
import { denominations, dataProducts, airtimeProducts } from "./order-utils";

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
  const [activeTab, setActiveTab] = useState<"data" | "airtime">("data");
  const displayProducts = activeTab === "data" ? dataProducts : airtimeProducts;

  return (
    <Card>
      <CardHeader className="pb-2.5 sm:pb-3">
        <CardTitle className="text-base sm:text-lg">Select Products</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Choose data bundles or airtime vouchers to order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 sm:space-y-3 px-2.5 sm:px-4">
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2">
          <Button
            type="button"
            variant={activeTab === "data" ? "default" : "outline"}
            onClick={() => setActiveTab("data")}
            className="flex-1 items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Wifi className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Data</span>
            <span className="sm:hidden text-xs">D</span>
          </Button>
          <Button
            type="button"
            variant={activeTab === "airtime" ? "default" : "outline"}
            onClick={() => setActiveTab("airtime")}
            className="flex-1 items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Smartphone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Airtime</span>
            <span className="sm:hidden text-xs">A</span>
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
          {displayProducts.map((denom) => {
            const isSelected = selected.has(denom.id);
            return (
              <button
                key={denom.id}
                type="button"
                onClick={() => onToggle(denom.id)}
                className={`relative p-2 sm:p-2.5 rounded-lg border-2 transition-all hover:shadow-md active:scale-95 ${isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
                  }`}
              >
                <div className="text-xs sm:text-sm font-bold">{denom.label}</div>
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
