import React from "react";
import { useFormContext } from "react-hook-form";
import { ArrowLeft, CheckCircle2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepHeader } from "../order/shared";
import { RedemptionFormValues } from "./schema";

interface ConfirmationStepProps {
  isLoading: boolean;
  giftDetails: any;
  onPrev: () => void;
  onSubmit: (values: RedemptionFormValues) => Promise<void>;
}

const NETWORK_LOGOS: Record<string, string> = {
  MTN: "/brands/mtn.svg",
  Airtel: "/brands/airtel-logo.png",
  Glo: "/brands/glo.png",
  "9Mobile": "/brands/9mobile.png",
};

function InvoiceRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 border-b border-[#ece6db] py-2.5 last:border-b-0">
      <dt className="shrink-0 text-[11px] text-[#858a80]">{label}</dt>
      <dd className="max-w-[65%] break-words text-right text-[12px] font-medium leading-5 text-[#2a4032]">{children}</dd>
    </div>
  );
}

export function ConfirmationStep({ isLoading, giftDetails, onPrev, onSubmit }: ConfirmationStepProps) {
  const form = useFormContext<RedemptionFormValues>();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const values = form.getValues();
  const isData = giftDetails?.giftType === "data";
  const rewardValue = isData
    ? `${giftDetails?.dataSize ?? "—"} MB`
    : `₦${(giftDetails?.amount ?? 0).toLocaleString()}`;
  const networkLogo = NETWORK_LOGOS[values.network];

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      await onSubmit(form.getValues());
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to process redemption");
    }
  };

  return (
    <div className="space-y-4">
      <StepHeader
        icon={FileCheck}
        title="Review your gift"
        description="Check the details before you confirm"
        step={3}
        totalSteps={3}
      />

      <section aria-label="Redemption summary" className="overflow-hidden border border-[#e3d9c7] bg-[#fffdf8]">
        <div className="flex items-center justify-between gap-3 border-b border-[#e8e0d2] bg-[#f7f3ea] px-4 py-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#8d7954]">Gift summary</p>
            <p className="mt-0.5 text-[12px] font-medium capitalize text-[#294331]">{giftDetails?.giftType ?? "Gift"} reward</p>
          </div>
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4d7654]" />
        </div>

        <dl className="px-4">
          <InvoiceRow label="Gift value">{rewardValue}</InvoiceRow>
          <InvoiceRow label="Phone number">{values.phoneNumber}</InvoiceRow>
          <InvoiceRow label="Network">
            <span className="inline-flex items-center justify-end gap-2">
              {networkLogo && <img src={networkLogo} alt="" className="max-h-5 max-w-8 object-contain" />}
              {values.network}
            </span>
          </InvoiceRow>
        </dl>
      </section>

      {submitError && (
        <Alert variant="destructive" className="rounded-none border-[#e8cbc5] bg-[#fbf4f1] text-[#854d43]">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <p className="text-[10px] leading-4 text-[#898d83]">
        Confirm only if the phone number and network above are correct.
      </p>

      <div className="grid grid-cols-[0.8fr_1.2fr] gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isLoading}
          className="h-12 rounded-sm border-[#d8d0c2] bg-transparent px-3 text-[#46574b] hover:bg-[#f5f1e8]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          isLoading={isLoading}
          className="h-12 rounded-sm bg-[#173f2d] px-3 text-white hover:bg-[#24553d]"
        >
          Confirm & redeem
        </Button>
      </div>
    </div>
  );
}
