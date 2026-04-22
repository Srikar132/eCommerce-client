"use client"
import { useRef } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { useGSAP } from "@gsap/react"
import Link from "next/link"

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  bgColor?: string
  circleColor?: string
  textColor?: string
  textHoverColor?: string
  circleSize?: number
}

export default function CustomButton({
  href,
  bgColor = "#ffffff",
  circleColor = "#111111",
  textColor = "#111111",
  textHoverColor = "#ffffff",
  circleSize = 50,
  className,
  children,
  ...props
}: ArrowButtonProps) {
  // Use a generic HTMLElement ref since it can be either a Link (anchor) or button
  const btnRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const circleRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const enterTl = useRef<gsap.core.Timeline | null>(null)
  const arrowTl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    const btn = btnRef.current
    if (!btn) return

    const label = labelRef.current!
    const arrow = arrowRef.current!
    const circ = circleRef.current!

    // const getExpandedSize = () => {
    //   const { width, height } = btn.getBoundingClientRect()
    //   return { width, height }
    // }

    enterTl.current = gsap.timeline({ paused: true })
      .to(circ, {
        scale: () => {
          const { width, height } = btn.getBoundingClientRect()
          // circle starts at circleSize px, needs to cover full btn
          return Math.ceil(Math.max(width, height) / circleSize) * 2.2
        },
        duration: 0.38,
        ease: "power3.inOut",
      }, 0)
      .to(label, { color: textHoverColor, duration: 0.22 }, 0.18)

    const startArrow = () => {
      arrowTl.current = gsap.timeline({ repeat: -1 })
        .to(arrow, { opacity: 0, x: 10, duration: 0.28, ease: "power2.in" })
        .set(arrow, { x: -10 })
        .to(arrow, { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" })
        .to(arrow, {}, "+=0.45")
    }

    const onEnter = () => {
      enterTl.current!.play()
      startArrow()
    }

    const onLeave = () => {
      enterTl.current!.reverse()
      arrowTl.current?.kill()
      gsap.to(arrow, { opacity: 1, x: 0, duration: 0.2 })
    }

    btn.addEventListener("mouseenter", onEnter)
    btn.addEventListener("mouseleave", onLeave)
    btn.addEventListener("touchstart", onEnter, { passive: true })
    btn.addEventListener("touchend", onLeave, { passive: true })

    return () => {
      btn.removeEventListener("mouseenter", onEnter)
      btn.removeEventListener("mouseleave", onLeave)
      btn.removeEventListener("touchstart", onEnter)
      btn.removeEventListener("touchend", onLeave)
      enterTl.current?.kill()
      arrowTl.current?.kill()
    }
  }, [circleColor, circleSize, textColor, textHoverColor])

  const commonProps = {
    className: cn(
      "relative inline-flex items-center overflow-hidden cursor-pointer rounded-full outline-none",
      "focus-visible:ring-4 focus-visible:ring-black/20",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    style: {
      background: bgColor,
      gap: "0.6rem",
      padding: `0.5rem ${0.5 + 0.07 * circleSize}rem 0.5rem 1.25rem`,
      minHeight: `${0.08 * circleSize}rem`
    }
  }

  const content = (
    <>
      <span
        ref={circleRef}
        aria-hidden
        className="absolute z-0 rounded-full"
        style={{
          width: circleSize,
          height: circleSize,
          background: circleColor,
          right: (4 / 22) * circleSize,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      <span
        ref={labelRef}
        className="relative z-20 whitespace-nowrap font-bold"
        style={{ color: textColor }}
      >
        {children}
      </span>

      <span
        className="absolute z-20 flex shrink-0 items-center justify-center rounded-full"
        style={{ width: circleSize, right: (4 / 22) * circleSize, height: circleSize }}
      >
        <span
          ref={arrowRef}
          className="flex items-center justify-center"
          style={{ color: textHoverColor }}
        >
          <ArrowRight size={circleSize * 0.45} />
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        ref={btnRef as React.Ref<HTMLAnchorElement>}
        {...commonProps}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={btnRef as React.Ref<HTMLButtonElement>}
      {...commonProps}
      {...props}
    >
      {content}
    </button>
  )
}
