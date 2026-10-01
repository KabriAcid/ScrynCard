import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import type { RedemptionFormValues } from "./schema";

interface GiftDetails {
  giftType: "airtime" | "data";
  amount?: number;
  dataSize?: number;
}

export interface SuccessConfirmationProps {
  values: RedemptionFormValues;
  giftDetails: GiftDetails | null;
  onComplete: () => void;
}

export function SuccessConfirmation({ onComplete }: SuccessConfirmationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(onComplete, 10_000);
    return () => window.clearTimeout(timeoutId);
  }, [onComplete]);

  useEffect(() => {
    let active = true;
    fetch("/Success-Lottie-Animation.json")
      .then((response) => response.json())
      .then((data) => {
        if (active) setAnimationData(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-1 py-3">
      <div className="h-56 w-56" role="img" aria-label="Redemption successful">
        {animationData && <Lottie animationData={animationData} loop={false} autoplay />}
      </div>
      <Button
        onClick={onComplete}
        className="h-11 w-full rounded-sm bg-[#173f2d] text-white hover:bg-[#24553d]"
      >
        Return home
      </Button>
    </div>
  );
}
