"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  id: string
  customerName: string
  customerRole: string | null
  reviewText: string
  isVerifiedPurchase: boolean
}

interface TestimonialsClientProps {
  testimonials: Testimonial[]
}

const TestimonialCard = ({ testimonial, className }: { testimonial: Testimonial, className?: string }) => (
  <div className={cn(
    "bg-background p-8 md:p-10 rounded-[40px] shadow-xl shadow-black/5 flex flex-col gap-6 w-full",
    className
  )}>
    {/* Quote Icon */}
    <div className="w-10 h-10 rounded-full bg-[#E1EEF4] flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#000000]">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21M14.017 21H21.017M14.017 21C12.9124 21 12.017 20.1046 12.017 19V15C12.017 12.7909 13.8079 11 16.017 11H17.017C18.1216 11 19.017 10.1046 19.017 9V5C19.017 3.89543 18.1216 3 17.017 3H14.017C12.9124 3 12.017 3.89543 12.017 5V6M3 21L3 18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21M3 21H10M3 21C1.89543 21 1 20.1046 1 19V15C1 12.7909 2.79086 11 5 11H6C7.10457 11 8 10.1046 8 9V5C8 3.89543 7.10457 3 6 3H3C1.89543 3 1 3.89543 1 5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>

    <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed italic">
      &ldquo;{testimonial.reviewText}&rdquo;
    </p>

    <div className="pt-6 border-t border-border mt-auto">
      <p className="font-bold text-lg text-foreground uppercase tracking-wider">
        {testimonial.customerName}
      </p>
      <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">
        {testimonial.isVerifiedPurchase ? "Verified Buyer" : testimonial.customerRole}
      </p>
    </div>
  </div>
)

const TestimonialsClient = ({ testimonials }: TestimonialsClientProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const displayedTestimonials = testimonials.slice(0, 10)

  // Split testimonials into left and right columns
  const leftCol = displayedTestimonials.filter((_, i) => i % 2 === 0)
  const rightCol = displayedTestimonials.filter((_, i) => i % 2 !== 0)

  useGSAP(() => {
    if (!displayedTestimonials.length) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px)", () => {
      let st: ScrollTrigger | undefined
      let tween: gsap.core.Tween | undefined

      // Build (or rebuild) the ScrollTrigger based on current dimensions.
      const build = () => {
        // Kill previous instances before rebuilding
        tween?.kill()
        st?.kill()

        const container = scrollContainerRef.current
        const section = sectionRef.current
        if (!container || !section) return

        // const containerHeight = container.scrollHeight
        // const screenHeight = window.innerHeight
        // Scroll exactly enough to reveal the bottom of the column
        // const scrollDistance = Math.max(containerHeight - screenHeight, 0)

        const getScrollDistance = () =>
          Math.max((container.scrollHeight ?? 0) - window.innerHeight, 0)

        tween = gsap.to(container, {
          y: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        st = tween.scrollTrigger!
      }

      build()

      // Re-build if fonts / images cause layout shift after mount
      const raf = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        cancelAnimationFrame(raf)
        tween?.kill()
        st?.kill()
      }
    })

    return () => mm.revert()
  }, { scope: sectionRef, dependencies: [displayedTestimonials.length] })

  if (!displayedTestimonials.length) return null

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#E1EEF4]"
    >
      <div className="relative lg:h-screen w-full flex items-center justify-center">

        {/* Fixed Central Text Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6">
          <div className="text-center max-w-4xl">
            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-foreground/40 uppercase mb-6 block">
              What Customers Say
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] text-foreground tracking-tighter">
              Over 500 <br />
              Happy Reviews
            </h2>
          </div>
        </div>

        {/* Scrolling Grid Layout (Desktop) */}
        <div className="hidden lg:block absolute inset-x-0 top-0 z-10 overflow-hidden h-screen">
          <div
            ref={scrollContainerRef}
            className="max-w-[1600px] mx-auto px-10 pt-[100vh] will-change-transform"
          >
            <div className="grid grid-cols-3 gap-12">
              {/* Left Column */}
              <div className="flex flex-col gap-12">
                {leftCol.map((t, i) => (
                  <div key={t.id} className="flex flex-col gap-12">
                    <TestimonialCard testimonial={t} />
                    {i % 2 === 0 && <div className="h-32" />}
                  </div>
                ))}
                <div className="h-[30vh]" />
              </div>

              {/* Middle Column (Spacer for text overlay) */}
              <div className="pointer-events-none" />

              {/* Right Column — staggered offset */}
              <div className="flex flex-col gap-12 pt-48">
                {rightCol.map((t, i) => (
                  <div key={t.id} className="flex flex-col gap-12">
                    <TestimonialCard testimonial={t} />
                    {i % 2 !== 0 && <div className="h-40" />}
                  </div>
                ))}
                <div className="h-[30vh]" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout: Horizontal Scroll */}
        <div className="lg:hidden relative z-30 w-full overflow-x-auto no-scrollbar pt-12 pb-8">
          <div className="flex gap-6 px-6 w-max">
            {displayedTestimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} className="w-[80vw] max-w-sm" />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default TestimonialsClient