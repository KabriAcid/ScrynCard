import React from "react";
import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, User } from "lucide-react";
import { StepHeader } from "../order/shared";
import { RedemptionFormValues, OCCUPATION_OPTIONS } from "./schema";

interface BioDataStepProps {
	isLoading: boolean;
	onNext: () => void;
	onPrev: () => void;
}

export function BioDataStep({ isLoading, onNext, onPrev }: BioDataStepProps) {
	const form = useFormContext<RedemptionFormValues>();

	const handleNext = async () => {
		const isValid = await form.trigger(["nin", "occupation"]);
		if (isValid) {
			onNext();
		}
	};

	return (
		<div className="space-y-6">
			<StepHeader
				icon={User}
				title="Beneficiary Information"
				description="Provide your National Identification Number and occupation for record purposes"
				step={1}
				totalSteps={3}
			/>

			<div className="space-y-4">
				{/* NIN Field */}
				<FormField
					control={form.control}
					name="nin"
					render={({ field }) => (
						<FormItem>
							<FormLabel>National Identification Number (NIN)</FormLabel>
							<FormControl>
								<div className="relative">
									<CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="12345678901"
										maxLength={11}
										{...field}
										disabled={isLoading}
										className="h-12 pl-10"
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, "");
											field.onChange(value);
										}}
									/>
								</div>
							</FormControl>
							<p className="text-xs text-muted-foreground mt-1">
								{field.value?.length || 0}/11 digits
							</p>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Occupation Field */}
				<FormField
					control={form.control}
					name="occupation"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Occupation</FormLabel>
							<FormControl>
								<div
									role="group"
									aria-label="Choose your occupation"
									className="grid grid-cols-2 gap-2 sm:grid-cols-3"
								>
									{OCCUPATION_OPTIONS.map((occupation) => (
										<button
											key={occupation}
											type="button"
											aria-pressed={field.value === occupation}
											disabled={isLoading}
											onClick={() => {
												field.onChange(occupation);
												form.clearErrors("occupation");
											}}
											className={`flex min-h-11 items-center justify-between gap-2 border px-3 py-2 text-left text-xs transition-colors disabled:opacity-50 sm:text-sm ${
												field.value === occupation
													? "border-[#173f2d] bg-[#f2f4ee] font-medium text-[#173f2d] ring-1 ring-[#173f2d]/15"
													: "border-[#e1dbcf] bg-[#fffdf8] text-[#536257] hover:border-[#b9a77e]"
											}`}
										>
											<span>{occupation}</span>
											{field.value === occupation && (
												<Check
													className="h-4 w-4 shrink-0"
													aria-hidden="true"
												/>
											)}
										</button>
									))}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-3 pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={onPrev}
					disabled={isLoading}
					className="h-12 flex-1 rounded-sm border-[#d8d0c2] bg-transparent text-[#46574b] hover:bg-[#f5f1e8]"
				>
					Back
				</Button>
				<Button
					type="button"
					onClick={handleNext}
					disabled={isLoading}
					className="h-12 flex-1 rounded-sm bg-[#173f2d] text-white hover:bg-[#24553d]"
				>
					Continue
				</Button>
			</div>
		</div>
	);
}
