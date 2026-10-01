import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredSample, supportingSamples } from "./homepage-data";

export function HomeHero() {
	return (
		<section className="mx-auto grid max-w-[1380px] items-center gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-14">
			<div className="relative z-10 max-w-[600px]">
				<h1 className="font-serif text-[clamp(3.4rem,7.1vw,6.5rem)] leading-[0.98] tracking-[-0.055em] text-[#173f2d]">
					A scratch card that{" "}
					<span className="italic text-[#a2783e]">gives more.</span>
				</h1>
				<p className="mt-7 max-w-[490px] text-base leading-8 text-[#647067] sm:text-lg sm:leading-9">
					Branded scratch cards turn airtime and data into a gift people
					remember. For your customers, your guests, and your team.
				</p>
				<div className="mt-9 flex flex-wrap items-center gap-3">
					<Link
						to="/order"
						className="inline-flex h-12 items-center gap-2 border border-[#b9b5aa] bg-white/35 px-5 text-sm font-medium text-[#34463a] transition hover:border-[#9a835c] hover:bg-white/60"
					>
						Order cards
					</Link>
					<Link
						to="/redeem"
						className="group relative isolate inline-flex h-12 items-center justify-center overflow-hidden bg-[#173f2d] px-6 text-sm font-medium text-white transition-colors hover:bg-[#24553d] before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-shine"
					>
						<span className="relative z-10 inline-flex items-center gap-3">
							Redeem your card <ArrowRight className="h-4 w-4" />
						</span>
					</Link>
				</div>
				<div className="mt-12 flex items-center gap-3 border-t border-[#e6e1d7] pt-5 text-xs leading-5 text-[#778077]">
					<Sparkles className="h-4 w-4 shrink-0 text-[#a2783e]" />A personal
					touch, with something useful inside.
				</div>
			</div>

			<div className="relative mx-auto w-full max-w-[650px] pb-8 pl-3 pr-7 pt-3 sm:pl-8 sm:pr-12 sm:pt-8">
				<div className="absolute inset-8 translate-x-3 translate-y-3 border border-[#d9c69f] sm:inset-12" />
				<div className="relative border border-white/80 bg-[#f0e9dc] p-2 shadow-[0_24px_65px_rgba(33,46,36,0.14)] sm:p-3">
					{featuredSample ? (
						<img
							src={featuredSample.src}
							alt={`${featuredSample.name} front design`}
							fetchPriority="high"
							className="aspect-[1.58/1] w-full object-cover"
						/>
					) : (
						<div className="flex aspect-[1.58/1] items-center justify-center bg-[#e9e1d2] text-[#718074]">
							Your card design
						</div>
					)}
					<div className="absolute -bottom-8 right-0 flex items-center gap-3 border border-[#e7e0d4] bg-[#faf8f3] p-2 shadow-[0_12px_34px_rgba(33,46,36,0.14)] sm:-bottom-9 sm:right-2 sm:gap-4 sm:p-3">
						{supportingSamples.map((sample) => (
							<img
								key={sample.src}
								src={sample.src}
								alt={sample.name}
								loading="lazy"
								className="h-[62px] w-[92px] object-cover sm:h-[78px] sm:w-[118px]"
							/>
						))}
						{supportingSamples.length === 0 && (
							<Gift className="m-5 h-7 w-7 text-[#a2783e]" />
						)}
						<Link
							to="/samples"
							className="mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#173f2d] text-white transition hover:bg-[#24553d]"
							aria-label="Browse all card designs"
						>
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
				<p className="absolute bottom-0 left-4 text-[10px] uppercase tracking-[0.18em] text-[#847d6d] sm:left-8">
					Made to be given. Made to be remembered.
				</p>
			</div>
		</section>
	);
}
