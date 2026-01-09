import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section id="hero-section" className="relative w-full overflow-hidden select-none">
            {/* Cloud Images at Top */}
            <div className="absolute -top-10 left-[5%] w-[200px] h-[120px] sm:w-[300px] sm:h-[180px] z-10 opacity-70 pointer-events-none">
                <Image
                    src="/images/home/cloud.webp"
                    alt=""
                    fill
                    className="object-contain select-none"
                    draggable={false}
                    priority
                />
            </div>
            
            <div className="absolute -top-5 right-[10%] w-[150px] h-[100px] sm:w-[250px] sm:h-[150px] z-10 opacity-60 pointer-events-none">
                <Image
                    src="/images/home/cloud.webp"
                    alt=""
                    fill
                    className="object-contain select-none"
                    draggable={false}
                    priority
                />
            </div>
            
            <div className="absolute top-20 left-[40%] w-[120px] h-20 sm:w-[200px] sm:h-[120px] z-10 opacity-50 hidden sm:block pointer-events-none">
                <Image
                    src="/images/home/cloud.webp"
                    alt=""
                    fill
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Soft Pink Gradient Blob - Top Left */}
            <div className="absolute -top-40 -left-30 w-[500px] h-[100px] sm:w-[700px] sm:h-[250px] bg-pink-400/70 rounded-full blur-[120px] z-10" />
            
            {/* Soft Blue Gradient Blob - Top Right */}
            <div className="absolute -top-40 right-1/3  w-[500px] h-[100px] sm:w-[700px] sm:h-[250px] bg-blue-300/70 rounded-full blur-[100px] z-10" />

            {/* Content Container */}
            <div className="relative min-h-[600px] sm:min-h-[700px] md:min-h-[750px] z-20 flex items-center justify-center py-20 sm:py-24 md:py-28">
                <div className="text-center  px-4 sm:px-6 max-w-4xl mx-auto mt-20">

                    {/* Brand Name */}
                    <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.3em] uppercase text-gray-700">
                            The Nala Armoire
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base font-light italic text-gray-600 tracking-wide">
                            where beauty roars in every stitch
                        </p>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium italic tracking-tight leading-tight">
                        Discover Handmade
                        <br />
                        Craftsmanship
                    </h1>

                    {/* CTA Button */}
                    <div className="pt-2 sm:pt-4">
                        <Link 
                            href="/products"
                            className="inline-block bg-primary text-primary-foreground px-8 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Shop Now
                        </Link>
                    </div>

                    {/* Decorative Floral Elements */}
                    <div className="absolute top-1/4 left-[3%] sm:left-[5%] w-16 h-16 sm:w-28 sm:h-28 opacity-60 pointer-events-none">
                        <Image
                            src="/images/home/flower2.png"
                            alt=""
                            fill
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>
                    
                    <div className="absolute -bottom-22 sm:-bottom-10 right-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44  pointer-events-none">
                        <Image
                            src="/images/home/flower3.webp"
                            alt=""
                            fill
                            className="object-cover select-none scale-150"
                            draggable={false}
                        />
                    </div>

                    <div className="absolute bottom-40 sm:bottom-50 right-[3%] sm:right-[10%] w-20 h-20 sm:w-32 sm:h-32 md:w-44 md:h-44 pointer-events-none">
                        <Image
                            src="/images/home/flower6.webp"
                            alt=""
                            fill
                            className="object-cover select-none scale-150"
                            draggable={false}
                        />
                    </div>
                    
                    <div className="absolute bottom-1/4 left-[3%] sm:left-[10%] w-20 h-20 sm:w-32 sm:h-32 md:w-44 md:h-44 scale-110  pointer-events-none">
                        <Image
                            src="/images/home/flower4.webp"
                            alt=""
                            fill
                            className="object-contain select-none scale-150"
                            draggable={false}
                        />
                    </div>

                    <div className="absolute bottom-0 left-[3%] sm:left-[5%] w-20 h-20 sm:w-32 sm:h-32 md:w-44 md:h-44 scale-125  pointer-events-none">
                        <Image
                            src="/images/home/flower5.webp"
                            alt=""
                            fill
                            className="object-contain select-none scale-150"
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-linear-to-b from-background/95 via-background/85 to-background/95 z-1 pointer-events-none" />
        </section>
    );
};

export default HeroSection;