import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HomeFooter } from "@/features/citizen/components/home/HomeFooter";
import { HomeHeader } from "@/features/citizen/components/home/HomeHeader";
import { HomeHero } from "@/features/citizen/components/home/HomeHero";
import {
	HomeFAQ,
	HomeStats,
} from "@/features/citizen/components/home/HomeHighlights";
import {
	howItWorksSteps,
	moments,
} from "@/features/citizen/components/home/homepage-data";

export default function HomePage() {
	return (
		<div
			className="min-h-screen bg-[#faf8f3] text-[#172d22]"
			style={{
				backgroundImage:
					"radial-gradient(rgba(23, 63, 45, 0.07) 1px, transparent 1px)",
				backgroundSize: "24px 24px",
			}}
		>
			<HomeHeader />

			<div aria-hidden="true" className="h-20 sm:h-24" />

			<main>
				<HomeHero />

				<HomeStats />

				<section className="border-y border-[#e8e2d7] bg-[#f3f0e8]">
					<div className="mx-auto grid max-w-[1380px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
						<p className="max-w-2xl font-serif text-xl leading-8 text-[#33483a] sm:text-2xl">
							A beautiful card on the outside. Airtime or data on the inside.
						</p>
						<p className="text-sm leading-6 text-[#737b70] md:max-w-[330px]">
							Recipients redeem online in a few simple steps, wherever the
							moment finds them.
						</p>
					</div>
				</section>

				<section
					id="occasions"
					className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
				>
					<div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">
								Many reasons to give
							</p>
							<h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight tracking-[-0.035em] text-[#173f2d] sm:text-5xl">
								One thoughtful reward. Endless occasions.
							</h2>
							<p className="mt-5 max-w-sm text-sm leading-7 text-[#69736a]">
								From everyday appreciation to once-in-a-lifetime celebrations,
								make the reward feel like it belongs to the moment.
							</p>
							<Link
								to="/samples"
								className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#31563d] hover:text-[#8e6c39]"
							>
								Find a little inspiration <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
						<div className="grid divide-y divide-[#e5dfd4] border-y border-[#e5dfd4] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
							{moments.map((moment) => (
								<article
									key={moment.number}
									className="py-6 sm:px-5 sm:py-2 lg:px-7"
								>
									<span className="font-serif text-sm italic text-[#a2783e]">
										{moment.number}
									</span>
									<h3 className="mt-5 font-serif text-2xl text-[#243d2e]">
										{moment.title}
									</h3>
									<p className="mt-3 text-sm leading-6 text-[#737b70]">
										{moment.description}
									</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section id="how-it-works" className="bg-[#173f2d] text-[#f8f5ed]">
					<div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:items-center lg:px-12">
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d1b785]">
								Simple from the first card
							</p>
							<h2 className="mt-5 max-w-md font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
								Give something they can use right away.
							</h2>
						</div>
						<div className="grid gap-7 sm:grid-cols-3 sm:gap-5">
							{howItWorksSteps.map((step, index) => (
								<div key={step.title} className="border-t border-white/20 pt-4">
									<span className="text-[10px] tracking-[0.2em] text-[#d1b785]">
										0{index + 1}
									</span>
									<h3 className="mt-3 font-serif text-2xl">{step.title}</h3>
									<p className="mt-2 text-sm leading-6 text-white/65">
										{step.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<HomeFAQ />

				<section className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-7 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center lg:px-12">
					<div>
						<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">
							Start with a look
						</p>
						<h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[#173f2d] sm:text-4xl">
							Find a card that feels like you.
						</h2>
					</div>
					<Link
						to="/samples"
						className="inline-flex h-12 items-center gap-3 border border-[#b6a682] px-6 text-sm font-medium text-[#284632] transition hover:bg-[#f1ecdf]"
					>
						Browse the sample gallery <ArrowRight className="h-4 w-4" />
					</Link>
				</section>
			</main>

			<HomeFooter />
		</div>
	);
}
