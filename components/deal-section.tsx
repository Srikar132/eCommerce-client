"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

interface DealCardProps {
  image : string;
  href : string;
}

const DealCard = ({image , href} : DealCardProps) => {
  return (
    <Link href={href} className="card-link">
      <Image
        src={image}
        alt="Deal Card"
        className="object-contain w-full h-auto aspect-auto"
        width={500}
        height={700}
      />
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
      pin: ".content",
      pinSpacing: false,
      // markers: true,
    });

    gsap.fromTo(
      ".card.left",
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
        scale: 0.92,
        opacity: 0.88,
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
      ".card.right",
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
        scale: 1.04,
        opacity: 0.95,
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
      gsap.set(".card.left", { y: vh * 1.5 });
      gsap.set(".card.right", { y: vh * 1.0 });
    });
  }, []);

  return (
    <section id="deal-section">
      <div className="section content">
        <div className="content-text">
          <h2 className="content-title">Exclusive Deals</h2>
          <p className="content-subtitle">
            Enjoy up to <span className="font-bold">50% OFF</span> on today’s hottest picks!
          </p>

          <Button className="content-button" variant="outline" size="lg">
            Check Now
          </Button>

          <div className="content-icon">
            <ChevronDown className="icon"/>
          </div>
        </div>

        <div className="cards-wrapper common-padding">
          <div className="card left">
            <DealCard image="/home/section2/sec1-col-1.webp" href="#" />
          </div>
          <div className="card right">
            <DealCard image="/home/section2/sec1-col-2.webp" href="#" />
          </div>  
        </div>
      </div>
    </section>
  );
}



