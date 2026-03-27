"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HERO_SLIDES } from "@/lib/constants";

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
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {HERO_SLIDES.map((slide) => (
              <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
                <div className="hero-grid grid min-h-[28rem] gap-10 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col justify-center gap-6"
                    initial={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <span className="inline-flex w-fit rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)] shadow-sm">
                      {slide.eyebrow}
                    </span>
                    <div className="space-y-4">
                      <h1 className="section-title max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                        {slide.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        className={buttonVariants({ size: "lg", variant: "primary" })}
                        href={slide.primaryAction.href}
                      >
                        {slide.primaryAction.label}
                      </Link>
                      <Link
                        className={buttonVariants({ size: "lg", variant: "outline" })}
                        href={slide.secondaryAction.href}
                      >
                        {slide.secondaryAction.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                  >
                    <div className="relative flex h-full min-h-72 w-full items-center justify-center overflow-hidden rounded-[2rem] bg-white/70 p-6">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(10,173,10,0.18),_transparent_50%)]" />
                      <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-emerald-100 blur-3xl" />
                      <div className="absolute -right-10 bottom-4 h-32 w-32 rounded-full bg-teal-100 blur-3xl" />
                      <Image
                        alt={slide.title}
                        className="relative z-10 h-auto max-h-80 w-full max-w-sm object-contain drop-shadow-[0_18px_32px_rgba(15,23,42,0.18)]"
                        height={520}
                        priority={slide.id === HERO_SLIDES[0].id}
                        src={slide.image}
                        width={520}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-2.5 rounded-full transition",
              selectedIndex === index
                ? "w-10 bg-[var(--brand)]"
                : "w-2.5 bg-slate-300 hover:bg-slate-400",
            )}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
