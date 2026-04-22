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


// gsap.registerPlugin(ScrollTrigger)

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

  // Ref to hold the goTo function to avoid circular dependency warnings
  const goToRef = useRef<(n: number) => void>(null);

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
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        0.3
      )

      // Restart auto-advance + progress
      if (timerRef.current) clearTimeout(timerRef.current)
      startProgress()
      timerRef.current = setTimeout(() => {
        // Use the ref to call the function to satisfy lint/compiler
        if (goToRef.current) {
          goToRef.current((next + 1) % total)
        }
      }, interval)
    },
    [interval, total, startProgress]
  )

  // Sync the ref
  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  // useGSAP(() => {
  //   if (!containerRef.current) return;

  //   const container = containerRef.current;
  //   /* Scroll parallax with proper spacing handling */
  //   ScrollTrigger.create({
  //     trigger: container,
  //     start: "top top",
  //     end: "bottom top",
  //     scrub: 1.2,
  //     pin: true,
  //     pinSpacing: false,
  //   });
  // }, {
  //   scope: containerRef
  // })

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
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.2 }
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
      style={{ height: "clamp(640px, 95vh, 1100px)" }}
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
          <Image
            ref={(el) => { imgRefs.current[i] = el }}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i == 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // quality={1}
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
          style={{ opacity: 0, visibility: "hidden" }}
        >
          {slides[current].eyebrow}
        </span>

        <h1
          ref={headingRef}
          className="font-black leading-none text-white mb-6 sm:mb-8"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", whiteSpace: "pre-line", opacity: 0, visibility: "hidden" }}
        >
          {slides[current].heading}
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
              {slides[current].buttonLabel}
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
          onClick={handlePrev}
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
          onClick={handleNext}
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