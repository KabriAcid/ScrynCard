import { ClipboardCheck, CreditCard, Smartphone, UserRound, Search } from "lucide-react";
import { FlowStepProgress } from "../FlowStepProgress";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const REDEMPTION_STEPS = [
  { label: "Card", icon: CreditCard },
  { label: "Verify", icon: Search },
  { label: "Details", icon: UserRound },
  { label: "Phone", icon: Smartphone },
  { label: "Finish", icon: ClipboardCheck },
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <FlowStepProgress
      steps={REDEMPTION_STEPS.slice(0, totalSteps)}
      currentStep={currentStep}
      label="Redemption progress"
    />
  );
}
