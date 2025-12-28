import { Building2, Hash, User, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BankTransferInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  reference: string;
}

interface BankTransferSectionProps {
  transferInfo: BankTransferInfo;
}

export function BankTransferSection({
  transferInfo,
}: BankTransferSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        Bank Transfer Details
      </h3>
      <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20">
        <p className="text-sm text-muted-foreground mb-4">
          Wire the payment to the following account:
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Bank Name
              </p>
              <p className="font-semibold">{transferInfo.bankName}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(transferInfo.bankName, "bank")}
              className={cn(
                "transition-all",
                copiedField === "bank" && "text-green-600"
              )}
            >
              {copiedField === "bank" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Account Number
              </p>
              <p className="font-bold text-lg font-mono">
                {transferInfo.accountNumber}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(transferInfo.accountNumber, "account")
              }
              className={cn(
                "transition-all",
                copiedField === "account" && "text-green-600"
              )}
            >
              {copiedField === "account" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                Account Name
              </p>
              <p className="font-semibold">{transferInfo.accountName}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(transferInfo.accountName, "name")}
              className={cn(
                "transition-all",
                copiedField === "name" && "text-green-600"
              )}
            >
              {copiedField === "name" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/30">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Payment Reference (Important!)
              </p>
              <p className="font-bold text-primary font-mono">
                {transferInfo.reference}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use this as narration/description when making transfer
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(transferInfo.reference, "reference")
              }
              className={cn(
                "transition-all",
                copiedField === "reference" && "text-green-600"
              )}
            >
              {copiedField === "reference" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            ⚠️ Important: Please include the payment reference in your transfer
            narration to ensure quick processing.
          </p>
        </div>
      </div>
    </div>
  );
}
