import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderTipsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">💡 Quick Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Minimum order value: ₦800,000</li>
          <li>• Mix data and airtime in one order</li>
          <li>• Data bundles valid for 30 days</li>
          <li>• Airtime never expires</li>
          <li>• 15% service fee applies to all orders</li>
          <li>• Processing cost: ₦200 per unit</li>
          <li>• Instant delivery after payment confirmation</li>
        </ul>
      </CardContent>
    </Card>
  );
}
