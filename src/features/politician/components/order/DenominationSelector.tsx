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
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Select Products</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Choose data bundles or airtime vouchers to order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant={activeTab === "data" ? "default" : "outline"}
            onClick={() => setActiveTab("data")}
            className="flex-1 items-center gap-1 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            <Wifi className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Data Bundles</span>
            <span className="sm:hidden">Data</span>
          </Button>
          <Button
            type="button"
            variant={activeTab === "airtime" ? "default" : "outline"}
            onClick={() => setActiveTab("airtime")}
            className="flex-1 items-center gap-1 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            <Smartphone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Airtime Vouchers</span>
            <span className="sm:hidden">Airtime</span>
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {displayProducts.map((denom) => {
            const isSelected = selected.has(denom.id);
            return (
              <button
                key={denom.id}
                type="button"
                onClick={() => onToggle(denom.id)}
                className={`relative p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all hover:shadow-md active:scale-95 ${isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
                  }`}
              >
                <div className="text-sm sm:text-base md:text-lg font-bold">{denom.label}</div>
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
