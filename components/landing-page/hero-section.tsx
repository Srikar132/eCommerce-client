"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import CustomButton from "../ui/custom-button"
import CustomButton2 from "../ui/custom-button-2"
import Image from "next/image";
import Link from "next/link";
// import { ScrollTrigger } from "gsap/all"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { HeroSlide as DbHeroSlide } from "@/lib/actions/content-actions";

/* ─────────────────────────────────────────────
   Types
 ───────────────────────────────────────────── */
export interface HeroSlide {
  imageUrl: string
  altText: string
  eyebrow: string
  heading: string
  textColor: string
  buttonLabel: string
}

interface HeroSectionProps {
  slides?: DbHeroSlide[] | HeroSlide[]
  interval?: number // ms between auto-advances
}

/* ─────────────────────────────────────────────
   Component
 ───────────────────────────────────────────── */
export default function HeroSection({
  slides: initialSlides,
  interval = 5000,
}: HeroSectionProps) {
  const slidesToUse = initialSlides ?? [];
  const total = slidesToUse.length;

  // ── ALL hooks must come before any conditional return ──
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef(0);
  const isAnimating = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const goToRef = useRef<(n: number) => void>(null);

  const startProgress = useCallback(() => {
    if (!progressRef.current) return;
    progressTween.current?.kill();
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
    progressTween.current = gsap.to(progressRef.current, {
      scaleX: 1,
      duration: interval / 1000,
      ease: "none",
    });
  }, [interval]);

  const goTo = useCallback(
    (next: number) => {
      if (isAnimating.current || next === currentRef.current) return;
      isAnimating.current = true;
      const prev = currentRef.current;
      currentRef.current = next;
      setCurrent(next);

      const outSlide = slideRefs.current[prev];
      const inSlide = slideRefs.current[next];
      const inImg = imgRefs.current[next];

      if (!outSlide || !inSlide || !inImg) {
        isAnimating.current = false;
        return;
      }

      gsap.set(inImg, { scale: 1.08, x: 4 });
      gsap.set(inSlide, { zIndex: 10, opacity: 1 });
      gsap.set(outSlide, { zIndex: 5 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(outSlide, { opacity: 0, zIndex: 0 });
          isAnimating.current = false;
        },
      });

      tl.to(inImg, { scale: 1, x: 0, duration: 1.4, ease: "power2.out" }, 0);
      tl.to(outSlide, { opacity: 0, duration: 0.65, ease: "power2.inOut" }, 0);

      if (eyebrowRef.current && headingRef.current && btnRef.current) {
        tl.fromTo(
          [eyebrowRef.current, headingRef.current, btnRef.current],
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
          0.3
        );
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      startProgress();
      timerRef.current = setTimeout(() => {
        goToRef.current?.((next + 1) % total);
      }, interval);
    },
    [interval, total, startProgress]
  );

  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  useGSAP(
    () => {
      // Guard — skip if no slides
      if (total === 0) return;

      slideRefs.current.forEach((s, i) => {
        if (!s) return;
        gsap.set(s, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 5 : 0 });
      });

      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        gsap.set(img, { scale: i === 0 ? 1 : 1.08, x: 0 });
      });

      gsap.to(imgRefs.current[0], {
        scale: 1.06,
        x: -6,
        duration: interval / 1000,
        ease: "none",
      });

      if (eyebrowRef.current && headingRef.current && btnRef.current) {
        gsap.fromTo(
          [eyebrowRef.current, headingRef.current, btnRef.current],
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.2 }
        );
      }

      startProgress();
      timerRef.current = setTimeout(() => {
        goTo(1 % total);
      }, interval);
    },
    { scope: containerRef, dependencies: [] }
  );

  // ── NOW safe to return early — all hooks already called ──
  if (total === 0) {
    return (
      <div
        className="w-full bg-background"
        style={{ height: "clamp(640px, 95vh, 1100px)" }}
      />
    );
  }

  // ... rest of JSX unchanged


  /* ── Render ────────────────────────────────── */
  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden select-none z-10"
      style={{ height: "clamp(640px, 95vh, 1100px)" }}
      aria-label="Hero carousel"
    >
      {/* ── Slide layers ── */}
      {slidesToUse.map((slide, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el }}
          className="absolute inset-0 will-change-[opacity]"
          aria-hidden={i !== current}
        >
          <Image
            ref={(el) => { imgRefs.current[i] = el }}
            src={slide.imageUrl}
            alt={slide.altText}
            fill
            priority={i == 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            draggable={false}
          />
        </div>
      ))}

      {/* ── Foreground text ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center max-w-7xl w-full px-8 sm:px-12 md:px-16 pointer-events-none">
        <span
          ref={eyebrowRef}
          className="block mb-3 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase"
          style={{
            opacity: 0,
            visibility: "hidden",
            color: slidesToUse[current].textColor
          }}
        >
          {slidesToUse[current].eyebrow}
        </span>

        <h1
          ref={headingRef}
          className="font-black leading-none mb-6 sm:mb-8"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            whiteSpace: "pre-line",
            opacity: 0,
            visibility: "hidden",
            color: slidesToUse[current].textColor
          }}
        >
          {slidesToUse[current].heading}
        </h1>

        <div ref={btnRef} className="pointer-events-auto" style={{ opacity: 0, visibility: "hidden" }}>
          <Link href={"/products"}>
            <CustomButton
              bgColor="#ffffff"
              circleColor="#111111"
              textColor="#111111"
              textHoverColor="#ffffff"
              circleSize={44}
            >
              {slidesToUse[current].buttonLabel}
            </CustomButton>
          </Link>
        </div>
      </div>

      {/* ── Bottom controls bar ── */}
      <div
        className="absolute bottom-20 right-6 sm:right-12 z-30 flex items-center gap-4"
        role="group"
        aria-label="Slide controls"
      >
        {/* Counter */}
        <span className="text-white/90 text-sm font-medium tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        {/* Progress track */}
        <span
          className="relative block overflow-hidden"
          style={{ width: 64, height: 2, background: "rgba(255,255,255,0.28)" }}
          aria-hidden="true"
        >
          <span
            ref={progressRef}
            className="absolute inset-0 bg-background"
            style={{ transformOrigin: "left center", }}
          />
        </span>

        {/* Prev */}
        <CustomButton2
          onClick={() => goTo(current - 1 < 0 ? total - 1 : current - 1)}
          aria-label="Previous slide"
          className="w-9 h-9 !p-0 rounded-full flex items-center justify-center border border-white/50"
          bgColor="transparent"
          fillColor="rgba(255,255,255,0.2)"
          textColor="#ffffff"
          textHoverColor="#ffffff"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </CustomButton2>

        {/* Next */}
        <CustomButton2
          onClick={() => goTo(current + 1 > total - 1 ? 0 : current + 1)}
          aria-label="Next slide"
          className="w-9 h-9 !p-0 rounded-full flex items-center justify-center border border-white/50"
          bgColor="transparent"
          fillColor="rgba(255,255,255,0.2)"
          textColor="#ffffff"
          textHoverColor="#ffffff"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </CustomButton2>
      </div>
    </section>
  )
}