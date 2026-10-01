import { ArrowLeft, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";
import { CardRedemptionForm } from "@/features/citizen/components/card-redemption-form";

export default function RedeemPage() {
  return (
    <div
      className="min-h-dvh bg-[#faf8f3] text-[#172d22]"
      style={{
        backgroundImage: "radial-gradient(rgba(23, 63, 45, 0.065) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <header className="sticky top-0 z-40 border-b border-[#e6e1d7] bg-[#faf8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Logo />
          <Link
            to="/"
            aria-label="Back to home"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#ded8cc] text-[#536257] transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 pb-8 pt-6 sm:pt-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#e1d6c1] bg-[#f5f0e5] text-[#8e6c39]">
            <Gift className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.21em] text-[#8e6c39]">Card redemption</p>
            <h1 className="mt-0.5 font-serif text-[1.7rem] leading-tight tracking-[-0.035em] text-[#173f2d]">Redeem your gift</h1>
          </div>
        </div>

        <p className="mb-5 max-w-sm text-[13px] leading-5 text-[#758076]">
          Enter the details from your card, then choose where to receive your gift.
        </p>

        <section className="redemption-premium -mx-4 border-y border-[#e5ded1] bg-[#fffdf8]/95 px-4 py-5 shadow-[0_14px_36px_rgba(33,46,36,0.055)] sm:mx-0 sm:border sm:px-6 sm:py-6">
          <CardRedemptionForm />
        </section>

        <p className="mt-5 text-center text-[11px] leading-5 text-[#899086]">
          Need a hand? <Link to="/how-it-works" className="font-medium text-[#526c58] underline decoration-[#d5c6a3] underline-offset-4">Read the redemption guide</Link>
        </p>
      </main>
    </div>
  );
}
