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
	const [animationData, setAnimationData] = useState<any>(null);
	const [secondsRemaining, setSecondsRemaining] = useState(10);

	useEffect(() => {
		const timeoutId = window.setTimeout(onComplete, 10_000);
		const intervalId = window.setInterval(() => {
			setSecondsRemaining((seconds) => Math.max(0, seconds - 1));
		}, 1000);
		return () => {
			window.clearTimeout(timeoutId);
			window.clearInterval(intervalId);
		};
	}, [onComplete]);

	useEffect(() => {
		const successSound = new Audio("/sounds/ding.mp3");
		void successSound.play().catch(() => undefined);

		return () => {
			successSound.pause();
			successSound.currentTime = 0;
		};
	}, []);

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
				{animationData && (
					<Lottie animationData={animationData} loop={false} autoplay />
				)}
			</div>
			<div className="mb-5 text-center">
				<h2 className="font-serif text-2xl font-medium text-[#173f2d]">
					Successful
				</h2>
				<p className="mt-2 text-sm leading-6 text-[#758076]">
					Your reward has been submitted. It may take a few moments to appear on
					your phone.
				</p>
				<p className="mt-3 text-xs text-[#899086]" aria-live="polite">
					Returning home in {secondsRemaining} seconds
				</p>
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
