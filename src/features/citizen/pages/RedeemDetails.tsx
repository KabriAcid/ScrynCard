import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";
import { DetailsForm } from "@/components/details-form";

export default function RedeemDetailsPage() {
  return (
    <div
      className="min-h-screen bg-[#faf8f3] text-[#172d22]"
      style={{
        backgroundImage: "radial-gradient(rgba(23, 63, 45, 0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <header className="border-b border-[#e6e1d7] bg-[#faf8f3]/85">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo />
          <Link to="/redeem" className="inline-flex items-center gap-2 rounded-full border border-[#d4d0c5] px-4 py-2 text-sm text-[#536257] transition hover:border-[#173f2d] hover:text-[#173f2d]">
            <ArrowLeft className="h-4 w-4" /> Back to redemption
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-7 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center border border-[#e1d6c1] bg-[#f5f0e5] text-[#8e6c39]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#8e6c39]">One last detail</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#173f2d] sm:text-5xl">Almost there</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#758076]">Please provide the requested information to complete your redemption.</p>
        </div>
        <section className="redemption-premium border border-[#e5ded1] bg-[#fffdf8]/95 p-5 shadow-[0_20px_60px_rgba(33,46,36,0.07)] sm:p-9">
          <DetailsForm />
        </section>
      </main>
    </div>
  );
}
