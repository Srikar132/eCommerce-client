import Image from "next/image";
import Link from "next/link";

const SplitScreenHero = () => {
    return (
        <section className="relative w-full overflow-hidden bg-background">
            <div className="flex flex-col lg:flex-row min-h-[60vh] lg:min-h-[85vh] w-full">

                {/* Left Side - Image with Text Overlay */}
                <div className="relative w-full lg:w-1/2 h-[60vh] lg:h-[85vh] overflow-hidden group">
                    <Image
                        src="/images/home/split-image-left.png"
                        alt="Fashion model in cozy sweater"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end items-start p-8 sm:p-10 lg:p-12 xl:p-16">
                        
                        {/* Label */}
                        <p className="text-white/90 text-xs sm:text-sm md:text-base font-light tracking-[0.2em] uppercase mb-4">
                            Most-loved collections
                        </p>

                        {/* Heading */}
                        <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium italic mb-6 sm:mb-8 leading-tight tracking-tight">
                            Cosy &<br />Comfort
                        </h2>

                        {/* CTA Button */}
                        <Link 
                            href="/products?featured=true"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm sm:text-base font-medium uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <span>Discover Now</span>
                            <svg 
                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Right Side - Video */}
                <div className="relative w-full lg:w-1/2 h-[60vh] lg:h-[85vh] overflow-hidden group">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    >
                        <source src="/home/section8/right-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Subtle Overlay for Consistency */}
                    <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                </div>
            </div>

            {/* Bottom Decorative Border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        </section>
    );
};

export default SplitScreenHero;
