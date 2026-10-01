import { Plus } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { frequentlyAskedQuestions, homeStats } from "./homepage-data";

export function HomeStats() {
	return (
		<section
			aria-label="Scryncard at a glance"
			className="border-y border-[#e8e2d7] bg-[#faf8f3]/85 backdrop-blur-sm"
		>
			<div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
				<div className="flex items-center justify-between gap-4 border-b border-[#e5dfd4] py-4">
					<h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#536257]">
						Platform impact
					</h2>
					<span className="border border-[#d9c69f] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8e6c39]">
						Investor preview
					</span>
				</div>
				<div className="grid grid-cols-1 divide-y divide-[#e5dfd4] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
					{homeStats.map((stat, index) => (
						<div
							key={stat.label}
							className={`py-6 sm:px-7 sm:py-8 ${index === 0 ? "sm:pl-0" : ""} ${index === homeStats.length - 1 ? "sm:pr-0" : ""}`}
						>
							<p
								className={`font-serif font-bold tracking-tight text-[#173f2d] ${stat.compact ? "text-4xl" : "text-5xl"}`}
							>
								{stat.value}
							</p>
							<p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#788076]">
								{stat.label}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export function HomeFAQ() {
	return (
		<section className="border-y border-[#e8e2d7] bg-[#fffdf8]">
			<div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.72fr_1.28fr] md:gap-16 lg:px-12">
				<div>
					<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">
						Good to know
					</p>
					<h2 className="mt-4 font-serif text-4xl leading-tight text-[#173f2d] sm:text-5xl">
						A few helpful answers.
					</h2>
					<p className="mt-4 max-w-sm text-sm leading-7 text-[#69736a]">
						Everything you need to know about ordering and redeeming a
						Scryncard.
					</p>
				</div>
				<Accordion
					type="single"
					collapsible
					className="border-t border-[#e5dfd4]"
				>
					{frequentlyAskedQuestions.map((item) => (
						<AccordionItem
							key={item.id}
							value={item.id}
							className="border-[#e5dfd4]"
						>
							<AccordionTrigger
								indicator={<Plus className="h-4 w-4" aria-hidden="true" />}
								className="py-5 text-left text-sm font-medium text-[#294331] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e6c39] focus-visible:ring-offset-2 sm:text-base"
							>
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="max-w-2xl text-sm leading-7 text-[#69736a] motion-reduce:animate-none">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
