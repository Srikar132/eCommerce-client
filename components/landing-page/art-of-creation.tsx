"use client"

import Image from "next/image"
import Link from "next/link"
import CustomButton from "../ui/custom-button"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export default function ArtOfCreation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const badge1Ref = useRef<HTMLDivElement>(null)
  const badge2Ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Subtle floating animation for badges
    gsap.to([badge1Ref.current, badge2Ref.current], {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    })

  }, { scope: containerRef })

  return (
    <section className="section relative z-30 overflow-hidden bg-background " ref={containerRef}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">


          {/* Text Content */}
          <div className="flex flex-col items-start gap-6 lg:gap-8 max-w-xl order-1 lg:order-2">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-foreground/60 uppercase">
              Our Story
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground tracking-tight">
              Delicate ruffles <br />
              with soft finishes.
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Where beauty roars in every stitch. Discover premium customizable fashion, handcrafted with love. Shop ethnic wear, contemporary styles, and personalized clothing at Nala Armoire.
            </p>

            <div className="pt-4">
              <Link href="/about">
                <CustomButton
                  bgColor="#000000"
                  circleColor="#ffffff"
                  textColor="#ffffff"
                  textHoverColor="#000000"
                  circleSize={44}
                >
                  Learn More
                </CustomButton>
              </Link>
            </div>
          </div>

          {/* Image Content - Image with floating badges */}
          <div className="relative flex justify-center items-center order-2 lg:order-1">
            {/* The Main Circular Image */}
            <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden shadow-2xl shadow-black/5">
              <Image
                src="/images/home/promise1.png"
                alt="Delicate ruffles showcase"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 300px, 500px"
              />
            </div>

            {/* Floating Badge 1 - Wow (Top Left) */}
            <div
              ref={badge1Ref}
              className="absolute  animate-bounce duration-[2000]   top-8! left-4 sm:left-10 z-20 bg-[#C6E8F0] px-6 py-3 rounded-full shadow-lg -rotate-12 flex items-center justify-center"
            >
              <span className="text-foreground font-bold text-sm sm:text-base">Wow</span>
            </div>

            {/* Floating Badge 2 - Playful (Bottom Right) */}
            <div
              ref={badge2Ref}
              className="absolute animate-pulse bottom-10 -right-4 sm:right-0 z-20 bg-[#FBCFCF] px-8 py-4 rounded-full shadow-lg rotate-12 flex items-center justify-center"
            >
              <span className="text-foreground font-bold text-sm sm:text-base">Playful</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
