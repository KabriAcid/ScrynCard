import { ArrowLeft, ArrowRight, CreditCard, Gift, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";
import { CardRedemptionForm } from "@/features/citizen/components/card-redemption-form";

const featuredSample = __SAMPLE_IMAGES__.find((sample) => !sample.isBack);

const reminders = [
  "Scratch to reveal the card code",
  "Keep your serial number nearby",
  "Choose the phone and network for delivery",
];

export default function RedeemPage() {
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
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-[#d4d0c5] px-4 py-2 text-sm text-[#536257] transition hover:border-[#173f2d] hover:text-[#173f2d]">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1380px] items-start gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:px-12 lg:py-16">
        <aside className="lg:sticky lg:top-10">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">
            <span className="h-px w-7 bg-[#b69054]" />
            A gift with your name on it
          </p>
          <h1 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] tracking-[-0.045em] text-[#173f2d] sm:text-5xl lg:text-[3.7rem]">
            A few simple steps, then it’s yours.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#68736a] sm:text-base">
            Enter the details from your card, choose where to receive your gift, and review everything before you confirm.
          </p>

          {featuredSample && (
            <Link to="/samples" className="group mt-8 hidden max-w-[520px] overflow-hidden border border-[#e5ddcf] bg-[#f0e9dc] p-2 shadow-[0_16px_40px_rgba(33,46,36,0.08)] lg:block">
              <img src={featuredSample.src} alt="Sample Scryn card design" className="aspect-[1.58/1] w-full object-cover transition duration-500 group-hover:scale-[1.015]" />
              <span className="flex items-center justify-between px-2 pb-1 pt-3 text-xs text-[#69736a]">
                <span>See the card collection</span>
                <ArrowRight className="h-4 w-4 text-[#8e6c39]" />
              </span>
            </Link>
          )}

          <div className="mt-8 grid gap-3 border-t border-[#e4ded3] pt-5 sm:grid-cols-3 lg:grid-cols-1">
            {reminders.map((reminder, index) => {
              const icons = [CreditCard, ShieldCheck, Phone];
              const Icon = icons[index];
              return (
                <div key={reminder} className="flex items-center gap-3 text-xs leading-5 text-[#6b756c]">
                  <span className="grid h-8 w-8 shrink-0 place-items-center border border-[#e0d6c3] bg-[#f4f0e7] text-[#8e6c39]">
                    <Icon className="h-4 w-4" />
                  </span>
                  {reminder}
                </div>
              );
            })}
          </div>

          <Link to="/how-it-works" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#31563d] transition hover:text-[#8e6c39]">
            How redemption works <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>

        <section className="redemption-premium border border-[#e5ded1] bg-[#fffdf8]/95 p-5 shadow-[0_20px_60px_rgba(33,46,36,0.07)] sm:p-8 lg:p-10">
          <div className="mb-7 border-b border-[#e8e1d5] pb-5 sm:mb-8 sm:pb-6">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.21em] text-[#8e6c39]">
              <Gift className="h-4 w-4" />
              Card redemption
            </div>
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[#173f2d] sm:text-4xl">Redeem your gift</h2>
            <p className="mt-2 text-sm leading-6 text-[#758076]">Follow each step. You can review your details before redeeming.</p>
          </div>
          <CardRedemptionForm />
        </section>
      </main>
      <footer className="border-t border-[#e6e1d7] px-5 py-5 text-center text-xs text-[#899086]">
        Your card, your gift. <span className="mx-1 text-[#b6a682]">◆</span> Need help? Visit our <Link to="/how-it-works" className="text-[#526c58] underline decoration-[#d5c6a3] underline-offset-4 hover:text-[#173f2d]">redemption guide</Link>.
      </footer>
    </div>
  );
}
