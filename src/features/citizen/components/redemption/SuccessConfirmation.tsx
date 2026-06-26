import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Gift, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RedemptionFormValues } from "./schema";
import successAnimation from "../../../../../public/Success-Lottie-Animation.json";

//  Types 

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

//  Sub-components 

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{children}</span>
    </div>
  );
}

interface DetailCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: number;
}

function DetailCard({ icon, title, children, delay }: DetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-4 shadow-sm divide-y divide-border"
    >
      <div className="flex items-center gap-3 pb-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      </div>
      <div className="pt-3 space-y-1">{children}</div>
    </motion.div>
  );
}

//  Network colour helper 

const NETWORK_COLORS: Record<string, string> = {
  MTN: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Airtel: "bg-red-100 text-red-800 border-red-300",
  Glo: "bg-green-100 text-green-800 border-green-300",
  "9Mobile": "bg-teal-100 text-teal-800 border-teal-300",
};

function networkColor(network: string) {
  return NETWORK_COLORS[network] ?? "bg-accent text-foreground border-border";
}

//  Main export 

export function SuccessConfirmation({
  values,
  giftDetails,
  onComplete,
}: SuccessConfirmationProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onComplete]);

  const giftValue =
    giftDetails?.giftType === "data"
      ? `${giftDetails.dataSize ?? ""}MB`
      : `${(giftDetails?.amount ?? 0).toLocaleString()}`;

  return (
    <div className="flex flex-col items-center gap-5 py-4 px-4">
      {/* Lottie animation */}
      <Lottie
        animationData={successAnimation}
        loop={false}
        style={{ width: 180, height: 180 }}
      />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center -mt-2"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Redemption Successful!
        </h2>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Your{" "}
          <span className="capitalize font-medium text-foreground">
            {giftDetails?.giftType}
          </span>{" "}
          gift has been sent.
        </p>
      </motion.div>

      {/* Detail cards */}
      <div className="w-full space-y-3">
        <DetailCard
          icon={<Gift className="h-4 w-4" />}
          title="Gift Details"
          delay={0.4}
        >
          <DetailRow label="Type">
            <Badge className="capitalize">{giftDetails?.giftType}</Badge>
          </DetailRow>
          <DetailRow label="Value">{giftValue}</DetailRow>
        </DetailCard>

        <DetailCard
          icon={<Phone className="h-4 w-4" />}
          title="Sent To"
          delay={0.55}
        >
          <DetailRow label="Phone">
            <span className="font-mono">{values.phoneNumber}</span>
          </DetailRow>
          <DetailRow label="Network">
            <Badge
              className={`text-xs font-semibold border ${networkColor(values.network)}`}
            >
              {values.network}
            </Badge>
          </DetailRow>
        </DetailCard>
      </div>

      {/* Countdown + action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.4 }}
        className="flex flex-col items-center gap-3"
      >
        <p className="text-sm text-muted-foreground">
          Redirecting in{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={countdown}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block font-bold text-primary tabular-nums"
            >
              {countdown}s
            </motion.span>
          </AnimatePresence>
        </p>

        <Button
          variant="outline"
          onClick={onComplete}
          className="border-2 hover:bg-primary/5 hover:border-primary transition-all"
        >
          Return Home Now
        </Button>
      </motion.div>
    </div>
  );
}
