import { Landmark, Banknote, CreditCard } from "lucide-react";

interface BankDetailsSectionProps {
  bankDetails: {
    accountNumber: string;
    bankName: string;
    bvn: string;
  };
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start">
      <Icon className="h-5 w-5 text-muted-foreground mr-4 mt-1" />
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}

export function BankDetailsSection({ bankDetails }: BankDetailsSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Landmark className="mr-2 h-5 w-5" /> Bank Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoRow
          icon={Landmark}
          label="Bank Name"
          value={bankDetails.bankName}
        />
        <InfoRow
          icon={Banknote}
          label="Account Number"
          value={`******${bankDetails.accountNumber.slice(-4)}`}
        />
        <InfoRow
          icon={CreditCard}
          label="BVN"
          value={`****-****-${bankDetails.bvn.slice(-4)}`}
        />
      </div>
    </div>
  );
}
