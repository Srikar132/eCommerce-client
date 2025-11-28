"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

export default function DealSection() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ensure we start from a deterministic state (override Tailwind transforms)
    const vh = window.innerHeight;

    // pin the content full-screen
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
        rotation: -150,
        rotateX: 50,
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

    // Optional: improve GPU usage / keep transforms clean on refresh
    ScrollTrigger.addEventListener("refreshInit", () => {
      // re-apply start positions if needed (helps on resize)
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
        </div>

        <div className="cards-wrapper common-padding">
          <div className="card left"></div>
          <div className="card right"></div>
        </div>
      </div>
    </section>
  );
}
