import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            gsap.set("#hero-text", {
                position: "fixed",
                bottom: "0",
                left: "50%",
                xPercent: -50,
                zIndex: 10,
                opacity: 1
            });

            ScrollTrigger.create({
                trigger: "#hero-section",
                start: "top top",
                end: "bottom bottom",
                onLeave: () => {
                    gsap.set("#hero-text", {
                        position: "absolute",
                        bottom: "0",
                        top: "auto",
                    });
                },
                onEnterBack: () => {
                    gsap.set("#hero-text", {
                        position: "fixed",
                        bottom: "0",
                        top: "auto",
                    });
                }
            });
        });

        mm.add("(max-width: 1023px)", () => {
            gsap.set("#hero-text", {
                clearProps: "position,bottom,left,xPercent,zIndex",
                opacity: 1
            });
        });

        return () => mm.revert();

    }, []);

    return (
        <section
            id="hero-section"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/home/section8/BANNER-wonder.webp"
                    alt="Hero Image"
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'top'
                    }}
                    priority
                // quality={90}
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20 lg:bg-black/10" />
            </div>

            <div className="relative lg:static h-full flex items-end justify-center">
                <div
                    id="hero-text"
                >
                    {/* Subtitle */}
                    <p id="sub-title">
                        Discover Your Style
                    </p>

                    {/* Main Heading */}
                    <h1 id="main-heading">
                        Where Beauty Roars in Every Stitch
                    </h1>


                    <div id="cta-wrapper">

                        <Link href={'/products'}>
                            <Button
                                size="lg"
                                className="cta-button-primary"
                            >
                                Shop Now
                            </Button>
                        </Link>


                        <Link href={'/contact'}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="cta-button-secondary"
                            >
                                Contact us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;