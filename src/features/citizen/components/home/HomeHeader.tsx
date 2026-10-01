import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { mobileNavigationItems } from "./homepage-data";

export function HomeHeader() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="fixed left-1/2 top-3 z-50 flex h-[60px] w-[calc(100%-1.5rem)] max-w-[1120px] -translate-x-1/2 items-center justify-between rounded-full border border-white/70 bg-[#faf8f3]/75 px-4 shadow-[0_10px_35px_rgba(23,45,34,0.10)] backdrop-blur-xl sm:top-4 sm:h-[64px] sm:w-[calc(100%-3rem)] sm:px-7">
			<Logo />
			<nav
				className="hidden items-center gap-9 text-[13px] text-[#536257] md:flex"
				aria-label="Main navigation"
			>
				<Link
					className="relative py-2 transition-colors duration-300 hover:text-[#173f2d] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#173f2d] after:transition-transform after:duration-300 hover:after:scale-x-100"
					to="/how-it-works"
				>
					How it works
				</Link>
				<Link
					className="relative py-2 transition-colors duration-300 hover:text-[#173f2d] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#173f2d] after:transition-transform after:duration-300 hover:after:scale-x-100"
					to="/samples"
				>
					Card gallery
				</Link>
			</nav>
			<div className="flex items-center gap-2 sm:gap-3">
				<Link
					to="/login"
					className="hidden h-10 items-center rounded-full border border-[#c8c9bc] bg-white/35 px-4 text-sm text-[#435449] transition hover:border-[#173f2d] hover:bg-white/60 sm:inline-flex"
				>
					Sign in
				</Link>
				<Link
					to="/order"
					className="group relative isolate inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-[#173f2d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#24553d] before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-shine sm:px-5"
				>
					<span className="relative z-10 inline-flex items-center gap-2">
						Order <ArrowUpRight className="h-4 w-4" />
					</span>
				</Link>
			</div>
			<button
				type="button"
				className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d9d3c7] text-[#294c35] md:hidden"
				aria-label={
					isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
				}
				aria-expanded={isMobileMenuOpen}
				aria-controls="mobile-navigation"
				onClick={() => setIsMobileMenuOpen((open) => !open)}
			>
				{isMobileMenuOpen ? (
					<X className="h-4 w-4" />
				) : (
					<Menu className="h-4 w-4" />
				)}
			</button>
			<nav
				id="mobile-navigation"
				aria-label="Mobile navigation"
				className={`${isMobileMenuOpen ? "block" : "hidden"} absolute left-0 right-0 top-full mt-2 rounded-lg border border-[#e6e1d7] bg-[#faf8f3] p-2 shadow-[0_12px_35px_rgba(23,45,34,0.14)] md:hidden`}
			>
				{mobileNavigationItems.map(({ label, href }) => (
					<Link
						key={href}
						to={href}
						onClick={() => setIsMobileMenuOpen(false)}
						className="flex min-h-11 items-center px-4 text-sm text-[#435449] transition-colors hover:bg-[#f1ecdf] hover:text-[#173f2d]"
					>
						{label}
					</Link>
				))}
			</nav>
		</header>
	);
}
