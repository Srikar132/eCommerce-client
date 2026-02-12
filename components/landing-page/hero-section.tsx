import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section id="hero-section" className="relative w-full overflow-hidden select-none bg-gradient-to-b from-background via-rose-100/95 to-background">
            {/* Cloud Images at Top - Fixed positioning to prevent overlap with navbar */}
            <div className="absolute top-4 sm:top-8 md:top-12 left-[5%] w-30 h-20 sm:w-45 sm:h-30 md:w-50 md:h-33.75 z-10 opacity-70 pointer-events-none">
                <Image
                    src="/images/home/cloud.webp"
                    alt=""
                    width={200}
                    height={135}
                    className="object-contain select-none"
                    style={{ width: '100%', height: 'auto' }}
                    draggable={false}
                    priority
                />
            </div>

            <div className="absolute top-8 sm:top-12 md:top-16 right-[10%] w-30 h-20 sm:w-45 sm:h-30 md:w-50 md:h-33.75 z-10 opacity-60 pointer-events-none">
                <Image
                    src="/images/home/cloud.webp"
                    alt=""
                    width={200}
                    height={135}
                    className="object-contain select-none"
                    style={{ width: '100%', height: 'auto' }}
                    draggable={false}
                    priority
                />
            </div>

            <div className="absolute top-24 sm:top-32 md:top-40 left-[35%] sm:left-[40%] w-30 h-20 sm:w-45 sm:h-30 md:w-50 md:h-33.75 z-10 opacity-50 hidden sm:block pointer-events-none">
                <Image
                    src="/images/home/cloud.webp"
                    alt=""
                    width={200}
                    height={135}
                    className="object-contain select-none"
                    style={{ width: '100%', height: 'auto' }}
                    draggable={false}
                />
            </div>

            {/* Content Container */}
            <div className="relative min-h-150 sm:min-h-175 md:min-h-187.5 z-20 flex items-center justify-center py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto w-full">

                    {/* Brand Name */}
                    <div className="space-y-2 mb-6 sm:mb-8">
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-[0.3em] uppercase text-muted-foreground">
                            Nala Armoire
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base font-light italic text-muted-foreground/80 tracking-wide">
                            where beauty roars in every stitch
                        </p>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight leading-tight mb-8 sm:mb-10 text-foreground">
                        Every piece tells a story <br /> Let's make yours - together.
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

                    {/* Decorative Floral Elements - Better responsive positioning */}
                    {/* Top Left Flower */}
                    <div className="absolute top-[15%] sm:top-[20%] left-[2%] sm:left-[5%] md:left-[8%] w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 opacity-90 pointer-events-none">
                        <Image
                            src="/images/home/flower2.webp"
                            alt=""
                            fill
                            sizes="(max-width: 640px) 48px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>

                    {/* Bottom Right Flower */}
                    <div className="absolute bottom-[5%] sm:bottom-[8%] right-[2%] sm:right-[5%] w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 pointer-events-none opacity-80">
                        <Image
                            src="/images/home/flower3.webp"
                            alt=""
                            fill
                            sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>

                    {/* Middle Right Flower */}
                    <div className="absolute top-[50%] sm:top-[55%] right-[5%] sm:right-[8%] md:right-[12%] w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 pointer-events-none opacity-90">
                        <Image
                            src="/images/home/flower6.webp"
                            alt=""
                            fill
                            sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>

                    {/* Middle Left Flower */}
                    <div className="absolute top-[55%] sm:top-[60%] left-[3%] sm:left-[8%] md:left-[12%] w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 pointer-events-none opacity-90">
                        <Image
                            src="/images/home/flower4.webp"
                            alt=""
                            fill
                            sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>

                    {/* Bottom Left Flower */}
                    <div className="absolute bottom-[10%] sm:bottom-[12%] left-[2%] sm:left-[5%] md:left-[8%] w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 pointer-events-none opacity-75">
                        <Image
                            src="/images/home/flower5.webp"
                            alt=""
                            width={112}
                            height={112}
                            className="object-contain select-none"
                            style={{ width: '100%', height: 'auto' }}
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-linear-to-b from-background/90 via-transparent to-background/90 z-1 pointer-events-none" />
        </section>
    );
};

export default HeroSection;