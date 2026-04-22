"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import CustomButton from "@/components/ui/custom-button"

const COLLECTIONS = [
    {
        id: 1,
        label: "Stitch",
        title: "Every Stitch Tells Your Story",
        subtitle: "EMBROIDERY COLLECTION",
        description: "Handcrafted embroidery placed exactly where you want it. Our artisans work stitch by stitch to bring your vision to life on any garment.",
        image: "/images/home/promise1.png",
    },
    {
        id: 2,
        label: "Wear",
        title: "Designed to Be Worn, Made to Last",
        subtitle: "CUSTOM WARDROBE",
        description: "We embroider your chosen motifs onto premium-quality clothing — so what you carry on your chest is a reflection of who you are.",
        image: "/images/home/promise2.png",
    },
    {
        id: 3,
        label: "Craft",
        title: "The Craft Behind Every Thread",
        subtitle: "OUR CRAFT",
        description: "Traditional needlework meets modern fashion. Each embroidered piece is finished by hand, ensuring no two garments are ever exactly alike.",
        image: "/images/home/promise3.png",
    },
    {
        id: 4,
        label: "Own",
        title: "Wear Something Truly Yours",
        subtitle: "MADE FOR YOU",
        description: "Choose a garment, choose your embroidery, and we'll create it. A wardrobe that's completely personal, stitched with intention from the very first thread.",
        image: "/images/home/promise4.png",
    },
]

export default function OurPromise() {
    const [activeIndex, setActiveIndex] = useState(0)

    // Refs for the two image slots (ping-pong crossfade — no DOM remount)
    const slotARef = useRef<HTMLDivElement>(null)
    const slotBRef = useRef<HTMLDivElement>(null)
    const slotAImgRef = useRef<HTMLImageElement | null>(null)
    const slotBImgRef = useRef<HTMLImageElement | null>(null)

    // Text overlay refs — queried once, never re-queried
    const subtitleRef = useRef<HTMLSpanElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)

    // Right-panel description refs
    const descSubtitleRef = useRef<HTMLParagraphElement>(null)
    const descBodyRef = useRef<HTMLParagraphElement>(null)

    // Track which slot is currently "front"
    const frontSlot = useRef<"A" | "B">("A")
    // Prevent overlapping transitions
    const isAnimating = useRef(false)
    // Running tweens we can kill cleanly
    const activeTweens = useRef<gsap.core.Tween[]>([])

    const killActiveTweens = useCallback(() => {
        activeTweens.current.forEach((t) => t.kill())
        activeTweens.current = []
    }, [])

    // One-time mount: seed slot A with the initial image, slot B hidden
    useEffect(() => {
        if (!slotARef.current || !slotBRef.current) return
        gsap.set(slotARef.current, { opacity: 1 })
        gsap.set(slotBRef.current, { opacity: 0 })
    }, [])

    const runTransition = useCallback((nextIndex: number) => {
        if (isAnimating.current) {
            // Snap-complete any in-flight animation immediately, then proceed
            killActiveTweens()
            const front = frontSlot.current === "A" ? slotARef.current : slotBRef.current
            const back = frontSlot.current === "A" ? slotBRef.current : slotARef.current
            if (front) gsap.set(front, { opacity: 1 })
            if (back) gsap.set(back, { opacity: 0 })
        }

        isAnimating.current = true

        const frontRef = frontSlot.current === "A" ? slotARef : slotBRef
        const backRef = frontSlot.current === "A" ? slotBRef : slotARef

        // Write incoming image into the back (hidden) slot BEFORE fading
        if (backRef.current) {
            const img = backRef.current.querySelector("img")
            if (img) {
                img.src = COLLECTIONS[nextIndex].image
                img.alt = COLLECTIONS[nextIndex].title
            }
        }

        const tl = gsap.timeline({
            onComplete: () => {
                frontSlot.current = frontSlot.current === "A" ? "B" : "A"
                isAnimating.current = false
            },
        })

        // Crossfade: back fades in, front fades out simultaneously
        tl.to(backRef.current, { opacity: 1, duration: 0.65, ease: "power2.inOut" }, 0)
        tl.to(frontRef.current, { opacity: 0, duration: 0.65, ease: "power2.inOut" }, 0)

        // Text overlay: quick fade+slide out, then new content fades+slides in
        const textEls = [subtitleRef.current, titleRef.current, buttonRef.current].filter(Boolean)
        tl.to(textEls, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" }, 0)
        tl.call(() => {
            // Swap text content mid-animation when it's invisible
            if (subtitleRef.current) subtitleRef.current.textContent = COLLECTIONS[nextIndex].subtitle
            if (titleRef.current) titleRef.current.textContent = COLLECTIONS[nextIndex].title
        })
        tl.fromTo(
            textEls,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power3.out" }
        )

        // Right panel description: fade out → swap → fade in
        const descEls = [descSubtitleRef.current, descBodyRef.current].filter(Boolean)
        tl.to(descEls, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0)
        tl.call(() => {
            if (descSubtitleRef.current) descSubtitleRef.current.textContent = COLLECTIONS[nextIndex].subtitle
            if (descBodyRef.current) descBodyRef.current.textContent = COLLECTIONS[nextIndex].description
        })
        tl.fromTo(
            descEls,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: "power2.out" }
        )

        activeTweens.current = [tl as unknown as gsap.core.Tween]
    }, [killActiveTweens])

    const handleSelect = useCallback((index: number) => {
        if (index === activeIndex) return
        setActiveIndex(index)
        runTransition(index)
    }, [activeIndex, runTransition])

    // Cleanup on unmount
    useEffect(() => () => killActiveTweens(), [killActiveTweens])

    const initial = COLLECTIONS[0]

    return (
        <section className="section bg-background">
            <div className="container">
                <div className="flex flex-col-reverse lg:flex-row rounded-[40px] overflow-hidden min-h-[580px] lg:min-h-[760px] shadow-xl shadow-black/5 border border-black/5">

                    {/* ── Left: Image Panel ── */}
                    <div className="relative w-full lg:w-1/2 h-[480px] lg:h-auto overflow-hidden bg-muted">

                        {/* Slot A — starts as front, shows first image */}
                        <div ref={slotARef} className="absolute inset-0 will-change-[opacity]">
                            <Image
                                ref={slotAImgRef}
                                src={initial.image}
                                alt={initial.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                fill
                            />
                        </div>

                        {/* Slot B — starts hidden, receives next image before crossfade */}
                        <div ref={slotBRef} className="absolute inset-0 will-change-[opacity]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={slotBImgRef}
                                src={initial.image}
                                alt={initial.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Gradient overlay — always on top of both slots */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />

                        {/* Text overlay — always mounted, content swapped via refs */}
                        <div className="absolute bottom-10 left-10 right-10 z-20 flex flex-col items-start gap-4">
                            <span
                                ref={subtitleRef}
                                className="text-[11px] font-bold tracking-[0.3em] text-white/70 uppercase"
                            >
                                {initial.subtitle}
                            </span>
                            <h2
                                ref={titleRef}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-white tracking-tight max-w-md"
                            >
                                {initial.title}
                            </h2>
                            <div ref={buttonRef} className="mt-4">
                                <CustomButton href="/products" circleSize={45}>
                                    Explore Collection
                                </CustomButton>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Category Selector ── */}
                    <div className="w-full lg:w-1/2 bg-[#F5F5C6] p-10 lg:p-20 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-bold tracking-[0.35em] text-black/30 uppercase mb-14 block text-center">
                            Embroidered For
                        </span>

                        <div className="flex flex-col items-center gap-2 w-full">
                            {COLLECTIONS.map((item, index) => {
                                const isActive = activeIndex === index
                                return (
                                    <div
                                        key={item.id}
                                        className="w-fit cursor-pointer"
                                        onMouseEnter={() => handleSelect(index)}
                                    >
                                        <span
                                            className={cn(
                                                "relative inline-block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight select-none transition-colors duration-300",
                                                isActive ? "text-black" : "text-black/20 hover:text-black/50"
                                            )}
                                        >
                                            {item.label}

                                            <span
                                                className="absolute left-0 -bottom-2 w-full overflow-hidden pointer-events-none"
                                                style={{ height: "12px" }}
                                                aria-hidden
                                            >
                                                <svg
                                                    viewBox="0 0 100 12"
                                                    preserveAspectRatio="none"
                                                    className="w-full h-full"
                                                    style={{
                                                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                                        transformOrigin: "left center",
                                                        transition: "transform 0.5s cubic-bezier(0.645,0.045,0.355,1)",
                                                    }}
                                                >
                                                    <path
                                                        d="M0 8 Q 25 0 50 8 T 100 8"
                                                        fill="none"
                                                        stroke="black"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </span>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Description — always mounted, content swapped via refs */}
                        <div className="mt-16 lg:mt-20 text-center max-w-xs space-y-3">
                            <p
                                ref={descSubtitleRef}
                                className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/50"
                            >
                                {initial.subtitle}
                            </p>
                            <p
                                ref={descBodyRef}
                                className="text-base text-black/60 leading-relaxed"
                            >
                                {initial.description}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}