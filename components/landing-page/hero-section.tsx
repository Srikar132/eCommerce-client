"use client"

import { useCallback, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import CustomButton from "../ui/custom-button"
import Link from "next/link";
import { ScrollTrigger } from "gsap/all"

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export interface HeroSlide {
  src: string
  alt: string
  eyebrow: string
  heading: string
  buttonLabel: string
}

interface HeroSectionProps {
  slides?: HeroSlide[]
  interval?: number // ms between auto-advances
}

/* ─────────────────────────────────────────────
   Defaults
───────────────────────────────────────────── */
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    src: "/images/home/hero-banner.png",
    alt: "Campaign one",
    eyebrow: "HANDCRAFTED ELEGANCE",
    heading: "Wear the Art\n Of Embroidery",
    buttonLabel: "Show Collection",
  },
]


gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function HeroSection({
  slides = DEFAULT_SLIDES,
  interval = 5000,
}: HeroSectionProps) {
  const total = slides.length;

  // ── State ──────────────────────────────────
  const [current, setCurrent] = useState(0)

  // ── DOM Refs ───────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  // ── Internal Refs (no re-render) ───────────
  const currentRef = useRef(0)          // shadow of `current` for closures
  const isAnimating = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressTween = useRef<gsap.core.Tween | null>(null)

  /* ── Helper: restart progress bar ─────────── */
  const startProgress = useCallback(() => {
    if (!progressRef.current) return
    progressTween.current?.kill()
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" })
    progressTween.current = gsap.to(progressRef.current, {
      scaleX: 1,
      duration: interval / 1000,
      ease: "none",
    })
  }, [interval])

  /* ── Core transition ───────────────────────── */
  const goTo = useCallback(
    (next: number) => {
      if (isAnimating.current || next === currentRef.current) return

      isAnimating.current = true
      const prev = currentRef.current
      currentRef.current = next

      // Update React state for text/counter
      setCurrent(next)

      const outSlide = slideRefs.current[prev]
      const inSlide = slideRefs.current[next]
      const inImg = imgRefs.current[next]

      // Position layers
      gsap.set(inImg, { scale: 1.08, x: 4 })
      gsap.set(inSlide, { zIndex: 10, opacity: 1 })
      gsap.set(outSlide, { zIndex: 5 })

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(outSlide, { opacity: 0, zIndex: 0 })
          isAnimating.current = false
        },
      })

      // Ken Burns on incoming image
      tl.to(inImg, { scale: 1, x: 0, duration: 1.4, ease: "power2.out" }, 0)

      // Fade out outgoing slide
      tl.to(outSlide, { opacity: 0, duration: 0.65, ease: "power2.inOut" }, 0)

      // Stagger text in
      tl.fromTo(
        [eyebrowRef.current, headingRef.current, btnRef.current],
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        0.3
      )

      // Restart auto-advance + progress
      if (timerRef.current) clearTimeout(timerRef.current)
      startProgress()
      timerRef.current = setTimeout(() => {
        goTo((next + 1) % total)
      }, interval)
    },
    [interval, total, startProgress]
  )

  useGSAP(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    /* Scroll parallax with proper spacing handling */
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      pin: true,
      pinSpacing: false,
      onLeaveBack: () => {
        // Ensure no gap on scroll back
        gsap.set(container, { clearProps: "all" })
      }
    });
  } , {
    scope : containerRef
  })

  /* ── Bootstrap (runs once, inside useGSAP) ── */
  useGSAP(
    () => {
      // Hide all slides except first
      slideRefs.current.forEach((s, i) => {
        if (!s) return
        gsap.set(s, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 5 : 0 })
      })

      // Prepare images
      imgRefs.current.forEach((img, i) => {
        if (!img) return
        gsap.set(img, { scale: i === 0 ? 1 : 1.08, x: 0 })
      })

      // First-slide Ken Burns
      gsap.to(imgRefs.current[0], {
        scale: 1.06,
        x: -6,
        duration: interval / 1000,
        ease: "none",
      })

      // Entrance text animation
      gsap.fromTo(
        [eyebrowRef.current, headingRef.current, btnRef.current],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      )

      startProgress()

      timerRef.current = setTimeout(() => {
        goTo(1 % total)
      }, interval)
    },
    { scope: containerRef, dependencies: [] }
    // empty deps → runs once; `goTo` is stable via useCallback + refs
  )

  /* ── Controls ──────────────────────────────── */
  const handlePrev = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    goTo((currentRef.current - 1 + total) % total)
  }

  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    goTo((currentRef.current + 1) % total)
  }

  /* ── Render ────────────────────────────────── */
  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden select-none z-10"
      style={{ height: "clamp(420px, 50vw, 880px)" }}
      aria-label="Hero carousel"
    >
      {/* ── Slide layers ── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el }}
          className="absolute inset-0 will-change-[opacity]"
          aria-hidden={i !== current}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={(el) => { imgRefs.current[i] = el }}
            src={slide.src}
            alt={slide.alt}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            draggable={false}
          />
        </div>
      ))}

      {/* ── Foreground text ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center max-w-7xl w-full px-8 sm:px-12 md:px-16 pointer-events-none">
        <span
          ref={eyebrowRef}
          className="block mb-3 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white"
        >
          {slides[current].eyebrow}
        </span>

        <h1
          ref={headingRef}
          className="font-black leading-none text-white mb-6 sm:mb-8"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", whiteSpace: "pre-line" }}
        >
          {slides[current].heading}
        </h1>

        <div ref={btnRef} className="pointer-events-auto">
          <Link href={"/products"}>
            <CustomButton
              bgColor="#ffffff"
              circleColor="#111111"
              textColor="#111111"
              textHoverColor="#ffffff"
              circleSize={44}
            >
              {slides[current].buttonLabel}
            </CustomButton>
          </Link>
        </div>
      </div>

      {/* ── Bottom controls bar ── */}
      <div
        className="absolute bottom-5 right-6 z-30 flex items-center gap-4"
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
            className="absolute inset-0 bg-white"
            style={{ transformOrigin: "left center", }}
          />
        </span>

        {/* Prev */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="flex items-center justify-center rounded-full border border-white/50 text-white
                     hover:bg-white/20 active:scale-95 transition-[background,transform] duration-150"
          style={{ width: 36, height: 36 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="flex items-center justify-center rounded-full border border-white/50 text-white
                     hover:bg-white/20 active:scale-95 transition-[background,transform] duration-150"
          style={{ width: 36, height: 36 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  )
}