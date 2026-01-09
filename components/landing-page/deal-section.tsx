"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DealCardProps {
  image: string;
  href: string;
}

const DealCard = ({ image, href }: DealCardProps) => {
  return (
    <Link 
      href={href} 
      className="block w-full h-full group z-30 pointer-events-auto"
    >
      <Card className="w-full h-full overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
        {/* Image Container */}
        <div className="relative w-full h-full overflow-hidden rounded-3xl m-2 shadow-2xl">
          <Image
            src={image}
            alt="Deal Product"
            fill
            className="object-cover drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 300px, 400px"
          />
        </div>
      </Card>
    </Link>
  );
};

export default function DealSection() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const vh = window.innerHeight;

    ScrollTrigger.create({
      trigger: "#deal-section",
      start: "top top",
      end: "bottom bottom",
      pin: ".deal-content",
      pinSpacing: false,
    });

    gsap.fromTo(
      ".deal-card-left",
      {
        y: vh * 1.5,
        rotation: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        transformOrigin: "50% 50%",
        force3D: true,
      },
      {
        y: -130,
        rotation: 35,
        rotateX: 45,
        scale: 0.95,
        opacity: 0.9,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: "#deal-section",
          start: "top top",
          end: "40% bottom",
          scrub: 0.6,
          id: "left-card",
        },
      }
    );

    gsap.fromTo(
      ".deal-card-right",
      {
        y: vh * 1.0,
        rotation: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        transformOrigin: "50% 50%",
        force3D: true,
      },
      {
        y: -70,
        rotation: -45,
        rotateX: 0,
        scale: 0.95,
        opacity: 0.9,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: "#deal-section",
          start: "35% top",
          end: "60% bottom",
          scrub: 0.6,
          id: "right-card",
        },
      }
    );

    ScrollTrigger.addEventListener("refreshInit", () => {
      gsap.set(".deal-card-left", { y: vh * 1.5 });
      gsap.set(".deal-card-right", { y: vh * 1.0 });
    });
  });

  return (
    <section 
      id="deal-section" 
      className="relative h-[300vh] bg-background"
    >
      <div className="deal-content h-screen relative flex items-center justify-center bg-secondary">
        
        {/* Text Content */}
        <div className="relative z-20 text-center flex items-center flex-col justify-center h-full px-4">
          
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium italic tracking-tight text-foreground mb-6">
            Exclusive Deals
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl max-w-4xl font-light uppercase text-muted-foreground tracking-wide mb-8">
            Enjoy up to <span className="font-semibold text-primary">50% OFF</span> on today's hottest picks!
          </p>

          {/* CTA Button */}
          <Link
            href="/products?sale=true"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-5 rounded-full text-base sm:text-lg font-medium uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            <span>Check Now</span>
          </Link>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ChevronDown className="w-8 h-8 text-muted-foreground animate-bounce" />
          </div>
        </div>

        {/* Cards Wrapper */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between gap-20 lg:gap-[150px] pointer-events-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          
          {/* Left Card */}
          <div className="deal-card-left w-[280px] sm:w-[320px] lg:w-[400px] aspect-3/4 z-10 will-change-transform">
            <DealCard image="/home/section7/left-1.webp" href="/products?sale=true" />
          </div>

          {/* Right Card */}
          <div className="deal-card-right w-[280px] sm:w-[320px] lg:w-[400px] aspect-3/4 z-10 will-change-transform">
            <DealCard image="/images/home/split-image-left.png" href="/products?sale=true" />
          </div>
        </div>

        {/* Decorative Gradient Blobs */}
        <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-accent/15 rounded-full blur-[120px] pointer-events-none z-0" />
      </div>
    </section>
  );
}
