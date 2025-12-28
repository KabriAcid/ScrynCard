import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderTipsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">💡 Quick Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Minimum order: 100 cards</li>
          <li>• ₦2k cards require min. 100 quantity</li>
          <li>• 15% service fee applies to all orders</li>
          <li>• Printing cost: ₦200 per card</li>
          <li>• Cards expire 1 year after delivery</li>
        </ul>
      </CardContent>
    </Card>
  );
}
