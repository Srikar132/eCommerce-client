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
        description: "Carefully chosen fabrics and materials for pieces that last.",
    },
    {
        icon: Leaf,
        title: "Sustainable Craft",
        description: "Honoring tradition while caring for our planet.",
    },
    {
        icon: Award,
        title: "Unique Designs",
        description: "One-of-a-kind pieces that tenderly knot your memories together.",
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
                    <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary/70 font-medium font-[var(--font-inter)]">
                        NaLa ARMOIRE Promise
                    </p>
                    <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-semibold italic tracking-wide text-foreground">
                        Why Choose Us
                    </h2>
                    <div className="flex items-center justify-center gap-3 pt-3">
                        <span className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-primary/50" />
                        <span className="w-2.5 h-2.5 rotate-45 bg-primary/30 border border-primary/50 rounded-sm" />
                        <span className="w-3 h-3 rotate-45 bg-primary/50 shadow-sm shadow-primary/30 rounded-sm" />
                        <span className="w-2.5 h-2.5 rotate-45 bg-primary/30 border border-primary/50 rounded-sm" />
                        <span className="w-16 sm:w-20 h-px bg-gradient-to-l from-transparent via-primary/50 to-primary/50" />
                    </div>
                </div>

                {/* Promise Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {promises.map((promise, index) => {
                        const Icon = promise.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-card/40 backdrop-blur-sm p-6 sm:p-8 border-l-2 border-rose-400/60 hover:border-rose-500 hover:bg-card/60 transition-all duration-500 rounded-lg"
                            >
                                {/* Icon Container */}
                                <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-rose-400/60 flex items-center justify-center mb-5 sm:mb-6 group-hover:border-rose-500 group-hover:bg-rose-50/50 transition-all duration-500 rounded-md">
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 group-hover:text-rose-600" strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className="font-[var(--font-heading)] text-lg sm:text-xl font-semibold italic text-foreground mb-3 tracking-wide">
                                    {promise.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground leading-relaxed font-normal tracking-wide font-[var(--font-inter)]">
                                    {promise.description}
                                </p>

                                {/* Decorative Line */}
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-400/60 group-hover:w-full transition-all duration-700 rounded-full" />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Decorative Text */}
                <div className="text-center mt-16 sm:mt-20 md:mt-24">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-primary/40" />
                        <span className="w-1.5 h-1.5 rotate-45 bg-primary/40 rounded-sm" />
                        <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-primary/40" />
                    </div>
                    <p className="font-[var(--font-heading)] text-lg sm:text-xl md:text-2xl text-foreground/80 italic font-semibold tracking-wide">
                        &ldquo;Every thread holds emotion, and every stitch tells a story&rdquo;
                    </p>
                </div>
            </div>

            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3 pointer-events-none" />
        </section>
    );
}
