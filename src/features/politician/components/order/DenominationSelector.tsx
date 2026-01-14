import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
      <CardHeader>
        <CardTitle>Select Products</CardTitle>
        <CardDescription>
          Choose data bundles or airtime vouchers to order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={activeTab === "data" ? "default" : "outline"}
            onClick={() => setActiveTab("data")}
            className="flex items-center gap-2"
          >
            <Wifi className="h-4 w-4" />
            Data Bundles
          </Button>
          <Button
            type="button"
            variant={activeTab === "airtime" ? "default" : "outline"}
            onClick={() => setActiveTab("airtime")}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Airtime Vouchers
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayProducts.map((denom) => {
            const isSelected = selected.has(denom.id);
            return (
              <button
                key={denom.id}
                type="button"
                onClick={() => onToggle(denom.id)}
                className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className="text-lg font-bold">{denom.label}</div>
                {activeTab === "data" && (
                  <Badge
                    variant="secondary"
                    className="absolute top-1 right-1 text-xs"
                  >
                    {denom.unit}
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
