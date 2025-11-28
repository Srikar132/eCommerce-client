import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Button } from "./ui/button";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {

    useGSAP(() => {
        // Only run animation on lg screens and above
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            // Animation for lg screens and above
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

        return () => mm.revert(); // Cleanup

    }, []);
    
    return (
        <section id="hero-section" className="relative h-[80vh] lg:h-[120vh] w-full overflow-hidden">

            <div className="z-0">
                <Image
                    src="/home/section8/BANNER-wonder.webp"
                    alt="Hero Image"
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'top'
                    }}
                    // className="w-full h-full "
                    priority
                />
            </div>

            <div className="relative lg:static h-full flex items-end justify-center">
                <div id="hero-text" className="text-center opacity-100 px-4 pb-8 md:pb-12 lg:pb-16">
                    <p className="uppercase font-bold text-white drop-shadow-lg">
                        Discover Your Style
                    </p>
                    <p className="mt-4 text-lg sm:text-xl md:text-2xl lg:text-5xl text-white drop-shadow-md uppercase font-medium">
                       WHERE BEAUTY ROARS IN EVERY STITCH
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Button className="bg-white text-black px-3 md:px-5 lg:px-7 py-5 lg:py-9 rounded-none cursor-pointer hover:bg-black hover:text-white lg:text-md">
                            Shop Now
                        </Button>
                        <Button className="bg-white text-black px-3 md:px-5 lg:px-7 py-5 lg:py-9 rounded-none cursor-pointer hover:bg-black hover:text-white lg:text-md">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>


        </section>
    );
}

export default HeroSection;