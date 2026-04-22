"use client"

import { useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

interface CustomButton2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor?: string
  fillColor?: string
  textColor?: string
  textHoverColor?: string
  href?: string
  target?: string
}

export default function CustomButton2({
  bgColor = "#ffffff",
  fillColor = "#111111",
  textColor = "#111111",
  textHoverColor = "#ffffff",
  href,
  target,
  className,
  children,
  ...props
}: CustomButton2Props) {
  const btnRef = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!btnRef.current || !fillRef.current || !labelRef.current) return

    const btn = btnRef.current
    const fill = fillRef.current
    const label = labelRef.current

    const tl = gsap.timeline({ paused: true })
      .to(fill, {
        width: "100%",
        duration: 0.4,
        ease: "power2.inOut"
      })
      .to(label, {
        color: textHoverColor,
        duration: 0.3,
        ease: "power2.out"
      }, 0.1)

    const onEnter = () => tl.play()
    const onLeave = () => tl.reverse()

    btn.addEventListener("mouseenter", onEnter)
    btn.addEventListener("mouseleave", onLeave)
    btn.addEventListener("touchstart", onEnter, { passive: true })
    btn.addEventListener("touchend", onLeave, { passive: true })

    return () => {
      btn.removeEventListener("mouseenter", onEnter)
      btn.removeEventListener("mouseleave", onLeave)
      btn.removeEventListener("touchstart", onEnter)
      btn.removeEventListener("touchend", onLeave)
      tl.kill()
    }
  }, [fillColor, textHoverColor, bgColor, textColor, href])

  const content = (
    <>
      <span
        ref={fillRef}
        aria-hidden
        className="absolute inset-y-0 left-0 w-0 z-0"
        style={{
          background: fillColor,
        }}
      />
      <span
        ref={labelRef}
        className="relative z-10 whitespace-nowrap"
        style={{ color: textColor }}
      >
        {children}
      </span>
    </>
  )

  const commonClasses = cn(
    "relative inline-flex items-center justify-center overflow-hidden cursor-pointer rounded-full outline-none",
    "px-8 py-3.5 font-bold text-sm transition-all duration-300",
    "focus-visible:ring-4 focus-visible:ring-black/20",
    "disabled:pointer-events-none disabled:opacity-50",
    "border border-black/5 shadow-sm",
    className
  )

  const commonStyles = {
    background: bgColor,
  }

  if (href) {
    return (
      <Link 
        href={href} 
        target={target} 
        ref={btnRef as React.Ref<HTMLAnchorElement>}
        className={commonClasses}
        style={commonStyles}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={btnRef as React.Ref<HTMLButtonElement>}
      className={commonClasses}
      style={commonStyles}
      {...props}
    >
      {content}
    </button>
  )
}
