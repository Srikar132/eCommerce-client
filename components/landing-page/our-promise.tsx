import Image from "next/image";
import { Heart, Sparkles, Leaf, Award } from "lucide-react";

const promises = [
    {
        icon: Heart,
        title: "Made with Love",
        description: "Every stitch is crafted with passion and care by our skilled artisans.",
    },
    {
        icon: Sparkles,
        title: "Premium Quality",
        description: "We use only the finest fabrics and materials for lasting elegance.",
    },
    {
        icon: Leaf,
        title: "Sustainable Craft",
        description: "Eco-friendly practices that honor both tradition and our planet.",
    },
    {
        icon: Award,
        title: "Unique Designs",
        description: "One-of-a-kind pieces that tell your personal story.",
    },
];

export default function OurPromise() {
    return (
        <section className="relative w-full py-20 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">

            {/* Decorative Flowers - Scattered around the section */}
            {/* Top Left Flower */}
            <div className="absolute top-8 sm:top-12 left-[5%] sm:left-[8%] w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 opacity-60 pointer-events-none">
                <Image
                    src="/images/home/flower2.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, 112px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Top Right Flower */}
            <div className="absolute top-16 sm:top-20 right-[8%] sm:right-[12%] w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-50 pointer-events-none">
                <Image
                    src="/images/home/flower5.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Middle Left Flower */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[2%] sm:left-[5%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 opacity-40 pointer-events-none hidden sm:block">
                <Image
                    src="/images/home/flower4.webp"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Middle Right Flower */}
            <div className="absolute top-1/2 -translate-y-1/2 right-[2%] sm:right-[5%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 opacity-45 pointer-events-none hidden sm:block">
                <Image
                    src="/images/home/flower3.webp"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 112px, 144px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Bottom Left Flower */}
            <div className="absolute bottom-12 sm:bottom-16 left-[10%] sm:left-[15%] w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-55 pointer-events-none">
                <Image
                    src="/images/home/flower6.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, 96px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Bottom Right Flower */}
            <div className="absolute bottom-8 sm:bottom-12 right-[10%] sm:right-[15%] w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 opacity-50 pointer-events-none">
                <Image
                    src="/images/home/flower2.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 88px, 112px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4">
                    <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-primary/80">
                        The NaLa Promise
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
                        Why Choose Us
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground italic max-w-2xl mx-auto">
                        More than just clothing — we create wearable memories
                    </p>
                </div>

                {/* Promise Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {promises.map((promise, index) => {
                        const Icon = promise.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-card/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Icon Container */}
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2 sm:mb-3 tracking-tight">
                                    {promise.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {promise.description}
                                </p>

                                {/* Decorative Corner */}
                                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 group-hover:border-primary/40 rounded-tr-lg transition-colors duration-500" />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Decorative Text */}
                <div className="text-center mt-12 sm:mt-16 md:mt-20">
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground italic">
                        &ldquo;Where every thread weaves a story of elegance&rdquo;
                    </p>
                </div>
            </div>

            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3 pointer-events-none" />
        </section>
    );
}
