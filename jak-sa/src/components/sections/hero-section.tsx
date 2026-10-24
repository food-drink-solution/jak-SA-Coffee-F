"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroSlide {
  image: string;
  title: string;
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function HeroSection({ slides, cta, locale }: { slides: HeroSlide[]; cta: string; locale: "ar" | "en" }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    if (slides.length <= 1 || paused || reduceMotion) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length, paused, reduceMotion]);

  return (
    <section
      id="mainslider"
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label={locale === "ar" ? "معرض الصور الرئيسي" : "Main showcase"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/*
        Slides stack via CSS Grid (col/row 1) instead of absolute positioning:
        the track grows with the tallest slide, so content is never clipped by
        the section's overflow-hidden when text wraps or zoom is increased.
        .hero-canvas fills the first viewport beneath the sticky header.
      */}
      <div className="grid w-full">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={`hero-canvas relative col-start-1 row-start-1 items-center transition-opacity duration-700 motion-reduce:transition-none ${
              i === active ? "z-10 flex opacity-100" : "z-0 opacity-0"
            }`}
            inert={i !== active}
            aria-hidden={i !== active}
          >
            <Image src={slide.image} alt={slide.title} fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-jak-primary)]/80 via-[var(--color-jak-primary)]/50 to-[var(--color-jak-primary)]/25 rtl:bg-gradient-to-l" />
            <div className="container-app relative flex w-full items-center justify-between gap-8 py-16 sm:py-20 lg:py-24">
              <div className="max-w-2xl text-[var(--color-header-foreground)]">
                <span className="mb-2.5 sm:mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-header-foreground)]/20 px-3 py-1 text-xs sm:text-sm font-bold text-[var(--color-header-foreground)] backdrop-blur-xs">
                  {locale === "ar" ? "المورد المعتمد للمقاهي والمطاعم" : "Certified B2B Supplier for Cafés"}
                </span>
                <h1 className="text-[clamp(1.75rem,4.5vw,3.25rem)] font-extrabold leading-[1.1]">{slide.title}</h1>
                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex h-11 min-h-[44px] items-center rounded-[var(--radius-md)] bg-[var(--color-header-foreground)] px-6 sm:px-8 text-sm font-extrabold text-[var(--color-jak-primary)] shadow-lg transition-all hover:bg-[var(--color-header-foreground)]/90 active:scale-[0.98] focus-ring-inverse"
                  >
                    {cta}
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex h-11 min-h-[44px] items-center rounded-[var(--radius-md)] border border-[var(--color-header-foreground)]/40 bg-[var(--color-header-foreground)]/10 px-5 text-sm font-bold text-[var(--color-header-foreground)] backdrop-blur-xs transition-all hover:bg-[var(--color-header-foreground)]/20 active:scale-[0.98] focus-ring-inverse"
                  >
                    {locale === "ar" ? "تواصل معنا" : "Contact Us"}
                  </Link>
                </div>
              </div>

              {/* Complementary highlights card on desktop — perfectly balances hero space and eliminates right-side void */}
              <div className="hidden lg:flex flex-col gap-3 rounded-2xl border border-[var(--color-header-foreground)]/20 bg-black/25 p-5 text-[var(--color-header-foreground)] backdrop-blur-md shadow-2xl shrink-0 w-80">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-header-foreground)]/15 text-lg" aria-hidden>🚚</span>
                  <div>
                    <p className="text-xs font-extrabold">{locale === "ar" ? "توصيل لكافة أنحاء المملكة" : "Kingdom-wide Delivery"}</p>
                    <p className="text-[11px] text-[var(--color-header-foreground)]/75">{locale === "ar" ? "خلال 48 - 72 ساعة" : "Within 48-72 hours"}</p>
                  </div>
                </div>
                <div className="h-px bg-[var(--color-header-foreground)]/15" />
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-header-foreground)]/15 text-lg" aria-hidden>⏱️</span>
                  <div>
                    <p className="text-xs font-extrabold">{locale === "ar" ? "تزويد وتوريد متواصل 24/7" : "24/7 Continuous Supply"}</p>
                    <p className="text-[11px] text-[var(--color-header-foreground)]/75">{locale === "ar" ? "طوال أيام الأسبوع" : "All week long"}</p>
                  </div>
                </div>
                <div className="h-px bg-[var(--color-header-foreground)]/15" />
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-header-foreground)]/15 text-lg" aria-hidden>☕</span>
                  <div>
                    <p className="text-xs font-extrabold">{locale === "ar" ? "+160 منتج عالي الجودة" : "160+ Premium Products"}</p>
                    <p className="text-[11px] text-[var(--color-header-foreground)]/75">{locale === "ar" ? "مصدر واحد لاحتياجاتك" : "One-stop source"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="absolute inset-x-0 z-10 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-black/20 p-1 backdrop-blur-xs bottom-[calc(env(safe-area-inset-bottom,0rem)+0.75rem)]">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={locale === "ar" ? `الشريحة ${i + 1}` : `Go to slide ${i + 1}`}
              aria-current={i === active}
              className="flex h-8 w-8 items-center justify-center rounded-full focus-ring-inverse cursor-pointer"
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
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
