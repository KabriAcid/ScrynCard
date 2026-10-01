import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

export function HomeFooter() {
	return (
		<footer className="border-t border-[#e6e1d7]">
			<div className="mx-auto flex max-w-[1380px] flex-col gap-4 px-5 py-6 text-sm text-[#7a8178] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
				<Logo />
				<p>
					Thoughtful rewards for businesses, events, and the people who make
					them matter.
				</p>
				<Link to="/redeem" className="hover:text-[#173f2d]">
					Redeem a card
				</Link>
			</div>
		</footer>
	);
}
