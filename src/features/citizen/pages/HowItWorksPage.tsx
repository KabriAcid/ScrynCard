import { ArrowRight, Check, CreditCard, Gift, House, Phone, Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

const redemptionSteps = [
  {
    number: "01",
    icon: CreditCard,
    title: "Reveal your card details",
    description: "Scratch the covered panel on your card to reveal its serial number and gift code. Keep both close; you’ll enter them together.",
    note: "You’ll need the serial number and the code under the scratch panel.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Verify the card",
    description: "Visit the redemption page and enter the serial number and gift code. Once verified, you’ll see the reward type and value before continuing.",
    note: "Check the gift details before you move on.",
  },
  {
    number: "03",
    icon: Phone,
    title: "Add your details",
    description: "Provide the requested beneficiary details, then enter the phone number that should receive the gift and choose its mobile network.",
    note: "MTN · Airtel · Glo · 9Mobile",
  },
  {
    number: "04",
    icon: Check,
    title: "Confirm and receive",
    description: "Review the card and phone details. Confirm when everything is correct, and the airtime or data gift is sent to the number you selected.",
    note: "Airtime and data gifts are supported.",
  },
];

export default function HowItWorksPage() {
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
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link to="/samples" className="text-sm text-[#647067] transition hover:text-[#173f2d]">Card gallery</Link>
            <Link to="/" className="inline-flex h-9 items-center gap-2 rounded-full border border-[#d4d0c5] px-4 text-sm text-[#34463a] transition hover:border-[#173f2d]">
              <House className="h-4 w-4" /><span className="hidden sm:inline">Home</span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1100px] px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24">
          <div className="mx-auto flex w-fit items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">
            <span className="h-px w-8 bg-[#b69054]" />
            A simple gift, made easy
            <span className="h-px w-8 bg-[#b69054]" />
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-[clamp(3rem,7vw,5.8rem)] leading-[0.98] tracking-[-0.05em] text-[#173f2d]">
            From scratch card to <span className="italic text-[#a2783e]">something useful.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#647067] sm:text-lg">
            Redeem your airtime or data gift in a few clear steps. Have your card and a mobile phone number ready.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/redeem" className="inline-flex h-12 items-center gap-3 bg-[#173f2d] px-6 text-sm font-medium text-white transition hover:bg-[#24553d]">
              Start redeeming <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/samples" className="inline-flex h-12 items-center gap-2 border border-[#b9b5aa] bg-white/35 px-5 text-sm font-medium text-[#34463a] transition hover:border-[#9a835c] hover:bg-white/60">
              Browse card designs
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-[1040px] px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="relative">
            <div aria-hidden="true" className="absolute bottom-20 left-[25px] top-8 w-px bg-[#d8c9a9] sm:left-[35px]" />
            <div className="space-y-4 sm:space-y-5">
              {redemptionSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <article key={step.number} className="relative grid gap-5 border border-[#e8e1d5] bg-[#faf8f3]/90 p-5 shadow-[0_10px_28px_rgba(33,46,36,0.035)] sm:grid-cols-[72px_1fr] sm:gap-8 sm:p-8">
                    <div className="relative z-10 flex h-[52px] w-[52px] items-center justify-center border border-[#d7c69f] bg-[#faf8f3] text-[#8e6c39] sm:ml-[-1px] sm:h-[70px] sm:w-[70px]">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-[10px] font-semibold tracking-[0.18em] text-[#a2783e]">STEP {step.number}</span>
                        <h2 className="font-serif text-2xl tracking-[-0.02em] text-[#173f2d] sm:text-3xl">{step.title}</h2>
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#68736a] sm:text-base">{step.description}</p>
                      <p className="mt-4 inline-flex items-center gap-2 border-t border-[#e7e1d7] pt-3 text-xs font-medium tracking-wide text-[#8b754f]">
                        {step.number === "04" ? <Gift className="h-4 w-4" /> : <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#b69054]" />}
                        {step.note}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8e2d7] bg-[#f3f0e8]">
          <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center lg:px-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8e6c39]">Ready when you are</p>
              <h2 className="mt-2 font-serif text-3xl text-[#173f2d]">Have your card nearby?</h2>
            </div>
            <Link to="/redeem" className="inline-flex h-12 items-center gap-3 bg-[#173f2d] px-6 text-sm font-medium text-white transition hover:bg-[#24553d]">
              Redeem your card <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1380px] flex-col gap-4 px-5 py-6 text-sm text-[#7a8178] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <Logo />
        <p>Questions? Return to the <Link to="/" className="underline decoration-[#b6a682] underline-offset-4 hover:text-[#173f2d]">Scryn homepage</Link>.</p>
      </footer>
    </div>
  );
}
