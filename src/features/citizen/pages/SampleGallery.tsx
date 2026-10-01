import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, House, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

const samples = __SAMPLE_IMAGES__;

export default function SampleGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeSample = activeIndex === null ? null : samples[activeIndex];

  const showPrevious = () => {
    if (activeIndex === null || samples.length === 0) return;
    setActiveIndex((activeIndex - 1 + samples.length) % samples.length);
  };
  const showNext = () => {
    if (activeIndex === null || samples.length === 0) return;
    setActiveIndex((activeIndex + 1) % samples.length);
  };

  useEffect(() => {
    if (!activeSample) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Escape") setActiveIndex(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeSample]);

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#172d22]">
      <header className="border-b border-[#e6e1d7] bg-[#faf8f3]/85">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#647067] transition hover:text-[#173f2d]">
            <House className="h-4 w-4" /> <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1380px] px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e6c39]">Scryncard collection</p>
            <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-[#173f2d] sm:text-5xl">Card gallery</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#69736a]">Browse the front designs and the shared card back. Select a card to view it full size.</p>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#8a8d82]">{samples.length} {samples.length === 1 ? "design" : "designs"}</p>
        </div>

        {samples.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {samples.map((sample, index) => (
              <button
                key={sample.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f2d] focus-visible:ring-offset-4"
                aria-label={`View ${sample.name} full size`}
              >
                <span className="block overflow-hidden border border-[#e4ded2] bg-[#f0e9dc] p-2 shadow-[0_8px_24px_rgba(33,46,36,0.06)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_rgba(33,46,36,0.13)] sm:p-2.5">
                  <img
                    src={sample.src}
                    alt={sample.name}
                    loading="lazy"
                    className="aspect-[1.58/1] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                </span>
                <span className="mt-3 block text-sm font-medium text-[#304738]">{sample.name}</span>
                <span className="mt-1 block text-xs text-[#899086]">{sample.isBack ? "Shared back design" : "Front design"}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="border-y border-[#e6e1d7] py-20 text-center">
            <h2 className="font-serif text-2xl text-[#173f2d]">No card designs yet</h2>
            <p className="mt-2 text-sm text-[#69736a]">Add image files to public/samples and they will appear here.</p>
          </div>
        )}
      </main>

      {activeSample && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-[#101713]/95 text-white backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeSample.name} photo viewer`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-7">
            <p className="truncate pr-4 text-sm font-medium">{activeSample.name}</p>
            <div className="flex shrink-0 items-center gap-4">
              <p className="text-xs tabular-nums text-white/50">{activeIndex + 1} / {samples.length}</p>
              <button type="button" onClick={() => setActiveIndex(null)} className="grid h-10 w-10 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close photo viewer">
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 pb-5 sm:px-20">
            {samples.length > 1 && (
              <button type="button" onClick={showPrevious} className="absolute left-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12" aria-label="Previous sample">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <img key={activeSample.src} src={activeSample.src} alt={activeSample.name} fetchPriority="high" className="h-full max-h-full w-full max-w-[1500px] object-contain" />
            {samples.length > 1 && (
              <button type="button" onClick={showNext} className="absolute right-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12" aria-label="Next sample">
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
          <footer className="shrink-0 px-4 pb-4 sm:px-7 sm:pb-5">
            <nav aria-label="Sample cards" className="no-scrollbar flex justify-center gap-2 overflow-x-auto pb-1">
              {samples.map((sample, index) => (
                <button key={sample.src} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show ${sample.name}`} aria-current={index === activeIndex ? "true" : undefined} className={`h-12 w-[4.5rem] shrink-0 overflow-hidden rounded border-2 bg-white/5 transition sm:h-14 sm:w-20 ${index === activeIndex ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}>
                  <img src={sample.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </nav>
          </footer>
        </div>
      )}
    </div>
  );
}
