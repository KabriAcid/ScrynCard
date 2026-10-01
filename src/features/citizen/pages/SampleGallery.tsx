import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import { useNavigate } from "react-router-dom";

const samples = __SAMPLE_IMAGES__;

export default function SampleGallery() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSample = samples[activeIndex];

  const showPrevious = () =>
    setActiveIndex((index) => (index - 1 + samples.length) % samples.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % samples.length);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Escape") navigate("/");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  if (!activeSample) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-semibold">No samples yet</h1>
          <p className="mt-2 text-sm text-white/60">Add card images to public/samples to show them here.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-[100svh] flex-col overflow-hidden bg-neutral-950 text-white">
      <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-7">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          aria-label="Back to home"
        >
          <House className="h-4 w-4" />
          <span className="hidden sm:inline">ScrynCard</span>
        </button>
        <p className="text-sm tabular-nums text-white/55">
          {activeIndex + 1} <span className="px-1">/</span> {samples.length}
        </p>
      </header>

      <section className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-5 sm:px-20">
        <button
          type="button"
          onClick={showPrevious}
          className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
          aria-label="Previous sample"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <img
          key={activeSample.src}
          src={activeSample.src}
          alt={activeSample.name}
          fetchPriority="high"
          className="h-full max-h-full w-full max-w-[1500px] object-contain"
        />

        <button
          type="button"
          onClick={showNext}
          className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
          aria-label="Next sample"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      <footer className="shrink-0 px-4 pb-4 sm:px-7 sm:pb-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h1 className="truncate text-sm font-medium sm:text-base">{activeSample.name}</h1>
          <p className="hidden shrink-0 text-xs text-white/45 sm:block">Use ← → to navigate · Esc to exit</p>
        </div>
        <nav aria-label="Sample cards" className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {samples.map((sample, index) => (
            <button
              key={sample.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${sample.name}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-white/5 transition sm:h-[4.5rem] sm:w-28 ${
                index === activeIndex ? "border-white" : "border-transparent opacity-55 hover:opacity-100"
              }`}
            >
              <img src={sample.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </nav>
      </footer>
    </main>
  );
}
