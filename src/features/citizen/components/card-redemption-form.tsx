import React from "react";
import { Form } from "@/components/ui/form";
import { useRedemptionFlow } from "./redemption/hooks/useRedemptionFlow";
import { RedemptionStepContent } from "./redemption/components/RedemptionStepContent";
import { StepIndicator } from "./redemption/StepIndicator";

export function CardRedemptionForm() {
  const {
    form,
    step,
    direction,
    isLoading,
    showSuccess,
    giftDetails,
    validationError,
    submittedValues,
    handleNextStep,
    handleRetryValidation,
    handlePrevStep,
    handleSuccessComplete,
    onSubmit,
  } = useRedemptionFlow();

  // Show success screen outside of form context
  if (showSuccess && submittedValues) {
    return (
      <div className="redemption-premium">
        <RedemptionStepContent
          step={step}
          direction={direction}
          showSuccess={showSuccess}
          isLoading={isLoading}
          giftDetails={giftDetails}
          validationError={validationError}
          submittedValues={submittedValues}
          form={form}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          onRetry={handleRetryValidation}
          onProceed={() => {
            form.setValue("phoneNumber", form.getValues("phoneNumber"));
            handleNextStep();
          }}
          onSuccessComplete={handleSuccessComplete}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

  return (
    <div className="redemption-premium">
      <StepIndicator currentStep={step} totalSteps={5} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <RedemptionStepContent
            step={step}
            direction={direction}
            showSuccess={showSuccess}
            isLoading={isLoading}
            giftDetails={giftDetails}
            validationError={validationError}
            submittedValues={submittedValues}
            form={form}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onRetry={handleRetryValidation}
            onProceed={() => {
              form.setValue("phoneNumber", form.getValues("phoneNumber"));
              handleNextStep();
            }}
            onSuccessComplete={handleSuccessComplete}
            onSubmit={onSubmit}
          />
        </form>
      </Form>
    </div>
  );
}
