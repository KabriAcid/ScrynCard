import { Link } from "react-router-dom";
import { Fingerprint, MapPin } from "lucide-react";

export function HomeFooter() {
	return (
		<footer className="bg-[#173f2d] text-[#f8f5ed]">
			<div className="mx-auto max-w-[1380px] px-5 pb-7 pt-12 sm:px-8 sm:pt-14 lg:px-12">
				<div className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:gap-16 lg:pb-12">
					<div className="max-w-sm">
						<div className="flex items-center gap-3">
							<Fingerprint
								className="h-6 w-6 text-[#d1b785]"
								aria-hidden="true"
							/>
							<span className="font-headline text-xl font-semibold">
								Scryn Ltd.
							</span>
						</div>
						<p className="mt-5 text-sm leading-6 text-white/65">
							Thoughtful, branded airtime and data gifts for businesses, events,
							and communities.
						</p>
					</div>

					<nav aria-label="Footer navigation">
						<h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d1b785]">
							Explore
						</h2>
						<ul className="mt-4 space-y-3 text-sm text-white/75">
							<li>
								<Link
									to="/order"
									className="transition-colors hover:text-white"
								>
									Order cards
								</Link>
							</li>
							<li>
								<Link
									to="/samples"
									className="transition-colors hover:text-white"
								>
									Card gallery
								</Link>
							</li>
							<li>
								<Link
									to="/how-it-works"
									className="transition-colors hover:text-white"
								>
									How it works
								</Link>
							</li>
							<li>
								<Link
									to="/redeem"
									className="transition-colors hover:text-white"
								>
									Redeem a card
								</Link>
							</li>
						</ul>
					</nav>

					<div>
						<h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d1b785]">
							Head office
						</h2>
						<p className="mt-4 flex items-center gap-2 text-sm text-white/75">
							<MapPin
								className="h-4 w-4 shrink-0 text-[#d1b785]"
								aria-hidden="true"
							/>
							Abuja, Nigeria
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2 pt-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
					<p>© 2025 Scryn Ltd. All rights reserved.</p>
					<p>Head office: Abuja, Nigeria</p>
				</div>
			</div>
		</footer>
	);
}
