interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
	return (
		<div
			role="status"
			aria-live="polite"
			className="mb-6 text-xs font-medium text-[#536257]"
		>
			Step {currentStep} of {totalSteps}
		</div>
	);
}
