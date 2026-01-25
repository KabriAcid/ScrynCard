import React from "react";
import { Form } from "@/components/ui/form";
import { useRedemptionFlow } from "./redemption/hooks/useRedemptionFlow";
import { RedemptionStepContent } from "./redemption/components/RedemptionStepContent";

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

  return (
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
  );
}
