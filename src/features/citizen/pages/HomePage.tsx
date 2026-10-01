import { ArrowRight, ArrowUpRight, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

const mobileNetworks = ["MTN", "Airtel", "Glo", "9Mobile"];

const frontSamples = __SAMPLE_IMAGES__.filter((sample) => !sample.isBack);
const featuredSample =
  frontSamples.find((sample) => sample.name.toLowerCase().includes("wedding")) ??
  frontSamples[0];
const supportingSamples = frontSamples
  .filter((sample) => sample.src !== featuredSample?.src)
  .slice(0, 2);

const moments = [
  {
    number: "01",
    title: "For your customers",
    description:
      "Thank loyal customers, welcome new ones, and give every visit a little more meaning.",
  },
  {
    number: "02",
    title: "For your celebrations",
    description:
      "Give guests a keepsake with a useful reward inside, made for weddings and special days.",
  },
  {
    number: "03",
    title: "For your people",
    description:
      "Recognize a team, mark a milestone, or bring a community together with a thoughtful gift.",
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-[#faf8f3] text-[#172d22]"
      style={{
        backgroundImage: "radial-gradient(rgba(23, 63, 45, 0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <header className="fixed left-1/2 top-3 z-50 flex h-[68px] w-[calc(100%-1.5rem)] max-w-[1120px] -translate-x-1/2 items-center justify-between rounded-full border border-white/70 bg-[#faf8f3]/75 px-4 shadow-[0_10px_35px_rgba(23,45,34,0.10)] backdrop-blur-xl sm:top-4 sm:h-[72px] sm:w-[calc(100%-3rem)] sm:px-7">
        <Logo />
        <nav className="hidden items-center gap-9 text-[13px] text-[#536257] md:flex" aria-label="Main navigation">
          <Link className="relative py-2 transition-colors duration-300 hover:text-[#173f2d] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#173f2d] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/how-it-works">How it works</Link>
          <Link className="relative py-2 transition-colors duration-300 hover:text-[#173f2d] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#173f2d] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/samples">Card gallery</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="hidden h-10 items-center rounded-full border border-[#c8c9bc] bg-white/35 px-4 text-sm text-[#435449] transition hover:border-[#173f2d] hover:bg-white/60 sm:inline-flex">Sign in</Link>
          <Link
            to="/redeem"
            className="group relative isolate inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-[#173f2d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#24553d] before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-shine sm:px-5"
          >
            <span className="relative z-10 inline-flex items-center gap-2">Redeem your card <ArrowUpRight className="h-4 w-4" /></span>
          </Link>
        </div>
      </header>

      <div aria-hidden="true" className="h-24 sm:h-28" />

      <main>
        <section className="mx-auto grid max-w-[1380px] items-center gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-14">
          <div className="relative z-10 max-w-[600px]">
            <div className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39] sm:text-[11px]">
              <span className="h-px w-8 bg-[#b69054]" />
              Rewards with your name on them
            </div>
            <h1 className="font-serif text-[clamp(3.4rem,7.1vw,6.5rem)] leading-[0.98] tracking-[-0.055em] text-[#173f2d]">
              Make a little gesture <span className="italic text-[#a2783e]">mean more.</span>
            </h1>
            <p className="mt-7 max-w-[490px] text-base leading-8 text-[#647067] sm:text-lg sm:leading-9">
              Branded scratch cards turn airtime and data into a gift people remember. For your customers, your guests, and your team.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/samples"
                className="inline-flex h-12 items-center gap-2 border border-[#b9b5aa] bg-white/35 px-5 text-sm font-medium text-[#34463a] transition hover:border-[#9a835c] hover:bg-white/60"
              >
                View card samples
              </Link>
              <Link
                to="/redeem"
                className="group relative isolate inline-flex h-12 items-center justify-center overflow-hidden bg-[#173f2d] px-6 text-sm font-medium text-white transition-colors hover:bg-[#24553d] before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-shine"
              >
                <span className="relative z-10 inline-flex items-center gap-3">Redeem your card <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-3 border-t border-[#e6e1d7] pt-5 text-xs leading-5 text-[#778077]">
              <Sparkles className="h-4 w-4 shrink-0 text-[#a2783e]" />
              A personal touch, with something useful inside.
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
                <div className="flex aspect-[1.58/1] items-center justify-center bg-[#e9e1d2] text-[#718074]">Your card design</div>
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
                {supportingSamples.length === 0 && <Gift className="m-5 h-7 w-7 text-[#a2783e]" />}
                <Link to="/samples" className="mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#173f2d] text-white transition hover:bg-[#24553d]" aria-label="Browse all card designs">
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <p className="absolute bottom-0 left-4 text-[10px] uppercase tracking-[0.18em] text-[#847d6d] sm:left-8">Made to be given. Made to be remembered.</p>
          </div>
        </section>

        <section aria-label="Scryncard at a glance" className="border-y border-[#e8e2d7] bg-[#faf8f3]/85 backdrop-blur-sm">
          <div className="mx-auto grid max-w-[1380px] grid-cols-1 divide-y divide-[#e5dfd4] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
            <div className="py-6 sm:px-7 sm:py-8">
              <p className="font-serif text-4xl tracking-tight text-[#173f2d]">{frontSamples.length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#788076]">Card designs to explore</p>
            </div>
            <div className="py-6 sm:px-7 sm:py-8">
              <p className="font-serif text-4xl tracking-tight text-[#173f2d]">{mobileNetworks.length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#788076]">Mobile networks listed</p>
            </div>
            <div className="py-6 sm:px-7 sm:py-8">
              <p className="font-serif text-4xl tracking-tight text-[#173f2d]">02</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#788076]">Reward types · airtime & data</p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8e2d7] bg-[#f3f0e8]">
          <div className="mx-auto grid max-w-[1380px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
            <p className="max-w-2xl font-serif text-xl leading-8 text-[#33483a] sm:text-2xl">
              A beautiful card on the outside. Airtime or data on the inside.
            </p>
            <p className="text-sm leading-6 text-[#737b70] md:max-w-[330px]">
              Recipients redeem online in a few simple steps, wherever the moment finds them.
            </p>
          </div>
        </section>

        <section id="occasions" className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">Many reasons to give</p>
              <h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight tracking-[-0.035em] text-[#173f2d] sm:text-5xl">
                One thoughtful reward. Endless occasions.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#69736a]">
                From everyday appreciation to once-in-a-lifetime celebrations, make the reward feel like it belongs to the moment.
              </p>
              <Link to="/samples" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#31563d] hover:text-[#8e6c39]">
                Find a little inspiration <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid divide-y divide-[#e5dfd4] border-y border-[#e5dfd4] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {moments.map((moment) => (
                <article key={moment.number} className="py-6 sm:px-5 sm:py-2 lg:px-7">
                  <span className="font-serif text-sm italic text-[#a2783e]">{moment.number}</span>
                  <h3 className="mt-5 font-serif text-2xl text-[#243d2e]">{moment.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#737b70]">{moment.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#173f2d] text-[#f8f5ed]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:items-center lg:px-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d1b785]">Simple from the first card</p>
              <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                Give something they can use right away.
              </h2>
            </div>
            <div className="grid gap-7 sm:grid-cols-3 sm:gap-5">
              {[
                ["Choose", "Pick the airtime or data reward that fits your moment."],
                ["Personalize", "Put your business, event, or message on the card."],
                ["Share", "Hand it over. They redeem it online in a few simple steps."],
              ].map(([title, description], index) => (
                <div key={title} className="border-t border-white/20 pt-4">
                  <span className="text-[10px] tracking-[0.2em] text-[#d1b785]">0{index + 1}</span>
                  <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-7 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center lg:px-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">Start with a look</p>
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[#173f2d] sm:text-4xl">Find a card that feels like you.</h2>
          </div>
          <Link to="/samples" className="inline-flex h-12 items-center gap-3 border border-[#b6a682] px-6 text-sm font-medium text-[#284632] transition hover:bg-[#f1ecdf]">
            Browse the sample gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#e6e1d7]">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 px-5 py-6 text-sm text-[#7a8178] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Logo />
          <p>Thoughtful rewards for businesses, events, and the people who make them matter.</p>
          <Link to="/redeem" className="hover:text-[#173f2d]">Redeem a card</Link>
        </div>
      </footer>
    </div>
  );
}
