import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderTipsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">💡 Quick Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Minimum data order: 5GB per unit</li>
          <li>• Minimum airtime: ₦2,000 per unit</li>
          <li>• Minimum total order: 100 units</li>
          <li>• 15% service fee applies to all orders</li>
          <li>• Processing cost: ₦200 per unit</li>
          <li>• Data valid for 30 days, Airtime never expires</li>
          <li>• Instant delivery after payment confirmation</li>
        </ul>
      </CardContent>
    </Card>
  );
}
