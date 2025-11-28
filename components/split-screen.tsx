import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SplitScreenHero = () => {
    return (
        <section className="w-full py-4 md:py-10 px-4">
            <div className="flex flex-col md:flex-row h-[60vh] md:h-[80vh] w-full">

                {/* Left Side - Image (Hidden on small screens) */}
                <div className="relative w-full md:w-1/2 h-full overflow-hidden hidden md:block">
                    <Image
                        src={"/home/section8/BANNER-wonder.webp"}
                        alt="Fashion model in cozy sweater"
                        width={800}
                        height={800}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-black/10 flex flex-col justify-center px-10">
                        <p className="text-white text-base font-light mb-4 tracking-wide">
                            Most-loved collections
                        </p>
                        <h1 className="text-white text-5xl lg:text-7xl font-medium mb-6 tracking-widest">
                            COSY &<br />COMFORT
                        </h1>
                        <Button className="bg-white text-black px-3 md:px-5 lg:px-7 py-5 lg:py-8 rounded-none cursor-pointer hover:bg-black hover:text-white hover:transition lg:text-md w-fit">
                            Discover Now
                        </Button>
                    </div>
                </div>

                {/* Right Side - Video (Always visible, solo on small screens) */}
                <div className="relative w-full md:w-1/2 h-full overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
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
