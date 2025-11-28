import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SplitScreenHero = () => {
    return (
        <section className="w-full overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh] w-full">

                {/* Left Side - Image with Text Overlay */}
                <div className="relative w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-[80vh] overflow-hidden">
                    <Image
                        src={"/home/section8/BANNER-wonder.webp"}
                        alt="Fashion model in cozy sweater"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-start px-6 sm:px-8 lg:px-12">
                        <p className="text-white text-sm sm:text-base font-light mb-3 sm:mb-4 tracking-wide">
                            Most-loved collections
                        </p>
                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium mb-4 sm:mb-6 leading-tight">
                            COSY &<br />COMFORT
                        </h1>
                        <Button className="bg-white text-black px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 rounded-none hover:bg-black hover:text-white transition-colors duration-300 text-sm sm:text-base font-medium">
                            Discover Now
                        </Button>
                    </div>
                </div>

                {/* Right Side - Video */}
                <div className="relative w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-[80vh] overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={"/home/section8/right-video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    );
};

export default SplitScreenHero;
