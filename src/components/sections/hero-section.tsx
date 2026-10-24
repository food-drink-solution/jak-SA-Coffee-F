"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroSlide {
  image: string;
  title: string;
}

export function HeroSection({ slides, cta, locale }: { slides: HeroSlide[]; cta: string; locale: "ar" | "en" }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section id="mainslider" className="relative overflow-hidden">
      <div className="relative h-[380px] w-full sm:h-[480px] md:h-[520px]">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== active}
          >
            <Image src={slide.image} alt={slide.title} fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[var(--color-primary)]/45" />
            <div className="relative flex h-full items-center container-app">
              <div className="max-w-xl text-white">
                <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{slide.title}</h1>
                <div className="mt-6">
                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex h-12 min-h-[44px] items-center rounded-[var(--radius-md)] bg-white px-8 text-sm font-extrabold text-[var(--color-primary)] shadow-lg transition-all hover:bg-white/90 active:scale-[0.98] focus-ring"
                  >
                    {cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 z-10 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-black/20 p-1 backdrop-blur-xs">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className="flex h-8 w-8 items-center justify-center rounded-full focus-ring cursor-pointer"
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
