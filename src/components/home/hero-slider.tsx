"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { HERO_SLIDES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const syncSelectedIndex = useEffectEvent(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
  });

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    syncSelectedIndex();
    emblaApi.on("select", syncSelectedIndex);

    const interval = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", syncSelectedIndex);
      window.clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <section className="-mt-8">
      <div className="relative overflow-hidden bg-[var(--brand)]">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {HERO_SLIDES.map((slide) => (
              <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
                <div className="relative min-h-[21rem] sm:min-h-[25rem] lg:min-h-[31.25rem]">
                  <Image
                    alt={slide.title}
                    className="object-cover object-center"
                    fill
                    priority={slide.id === HERO_SLIDES[0].id}
                    sizes="100vw"
                    src={slide.image}
                  />
                  <div className="absolute inset-0 bg-[rgba(10,173,10,0.66)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(6,120,6,0.34)_0%,_rgba(6,120,6,0.18)_38%,_rgba(6,120,6,0.08)_60%,_transparent_100%)]" />

                  <div className="relative z-10 flex min-h-[21rem] max-w-[32rem] flex-col justify-center px-6 py-12 text-white sm:min-h-[25rem] sm:px-10 lg:min-h-[31.25rem] lg:px-14">
                    <div className="space-y-4 sm:space-y-5">
                      <h1 className="section-title max-w-[16rem] text-[2.35rem] font-bold leading-[1.02] tracking-[-0.05em] text-white sm:max-w-[18rem] sm:text-[3rem] lg:max-w-[19rem] lg:text-[3.25rem]">
                        {slide.title}
                      </h1>
                      <p className="max-w-md text-lg font-medium leading-7 text-white/95 sm:text-[1.05rem]">
                        {slide.description}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        className="inline-flex h-14 items-center justify-center rounded-[0.85rem] border border-white/80 bg-white px-8 text-lg font-semibold text-[var(--brand)] transition hover:bg-slate-100"
                        href={slide.primaryAction.href}
                      >
                        {slide.primaryAction.label}
                      </Link>
                      <Link
                        className="inline-flex h-14 items-center justify-center rounded-[0.85rem] border border-white/70 bg-transparent px-8 text-lg font-semibold text-white transition hover:bg-white/10"
                        href={slide.secondaryAction.href}
                      >
                        {slide.secondaryAction.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-[0_14px_32px_rgba(15,23,42,0.16)] transition hover:scale-[1.03] sm:flex lg:left-5"
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <button
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-[0_14px_32px_rgba(15,23,42,0.16)] transition hover:scale-[1.03] sm:flex lg:right-5"
          type="button"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-7 w-7" />
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-3 rounded-full border border-white/60 transition",
                selectedIndex === index
                  ? "w-10 bg-white"
                  : "w-3 bg-white/55 hover:bg-white/75",
              )}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
