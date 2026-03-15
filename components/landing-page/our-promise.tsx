import Image from "next/image";
import { Heart, Sparkles, Leaf, Award } from "lucide-react";

const promises = [
    {
        icon: Heart,
        title: "Made with Love",
        description:
            "Every stitch is crafted with passion and care by our skilled artisans. We believe the energy put into a garment is felt by the wearer.",
        image: "/images/home/promise1.png", // PLACEHOLDER — replace with your image
    },
    {
        icon: Sparkles,
        title: "Premium Quality",
        description:
            "Carefully chosen fabrics and materials for pieces that last. We source only the finest natural fibers to ensure longevity.",
        image: "/images/home/promise2.png", // PLACEHOLDER — replace with your image
    },
    {
        icon: Leaf,
        title: "Sustainable Craft",
        description:
            "Honoring tradition while caring for our planet. Our production process minimizes waste and supports local ecosystems.",
        image: "/images/home/promise3.png", // PLACEHOLDER — replace with your image
    },
    {
        icon: Award,
        title: "Unique Designs",
        description:
            "One-of-a-kind pieces that tenderly knot your memories together. We create timeless heirlooms that celebrate individuality.",
        image: "/images/home/promise4.png", // PLACEHOLDER — replace with your image
    },
];

export default function OurPromise() {
    return (
        <section className="relative w-full py-16 sm:py-20 md:py-28 overflow-hidden bg-background">
            {/* ── Decorative Background Flowers ── */}
            <div className="absolute top-8 sm:top-12 left-[5%] sm:left-[8%] w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 opacity-40 pointer-events-none">
                <Image src="/images/home/flower2.webp" alt="" fill sizes="112px" className="object-contain select-none" draggable={false} />
            </div>
            <div className="absolute top-16 sm:top-20 right-[8%] sm:right-[12%] w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-30 pointer-events-none">
                <Image src="/images/home/flower5.webp" alt="" fill sizes="128px" className="object-contain select-none" draggable={false} />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[2%] sm:left-[4%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 opacity-25 pointer-events-none hidden sm:block">
                <Image src="/images/home/flower4.webp" alt="" fill sizes="160px" className="object-contain select-none" draggable={false} />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-[2%] sm:right-[4%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 opacity-25 pointer-events-none hidden sm:block">
                <Image src="/images/home/flower3.webp" alt="" fill sizes="144px" className="object-contain select-none" draggable={false} />
            </div>
            <div className="absolute bottom-12 sm:bottom-16 left-[10%] sm:left-[15%] w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-35 pointer-events-none">
                <Image src="/images/home/flower6.webp" alt="" fill sizes="96px" className="object-contain select-none" draggable={false} />
            </div>
            <div className="absolute bottom-8 sm:bottom-12 right-[6%] sm:right-[10%] w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 opacity-30 pointer-events-none">
                <Image src="/images/home/flower2.webp" alt="" fill sizes="112px" className="object-contain select-none" draggable={false} />
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 w-full p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Section Header — Center aligned */}
                <div className="mb-10 sm:mb-14 md:mb-16 space-y-3 text-center flex flex-col items-center">
                    <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary/70 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                        NaLa ARMOIRE Promise
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold italic tracking-wide text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        Why Choose Us
                    </h2>
                    <span className="block w-16 sm:w-20 h-0.75 bg-primary/60 rounded-full" />
                </div>

                {/* Main Layout: Hero Image + Cards Grid */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-18">
                    {/* Left — Large Hero Image */}
                    <div className="relative w-full lg:w-[45%] xl:w-[42%] shrink-0">
                        <div className="relative aspect-4/5 sm:aspect-5/6 lg:aspect-4/5 w-full rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src="/images/home/promise-hero.png" // PLACEHOLDER — replace with your hero image
                                alt="Our workshop"
                                fill
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Quote Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-70 bg-card/90 backdrop-blur-sm rounded-lg p-4 sm:p-5 shadow-md border border-border/50">
                            <p className="text-sm sm:text-base italic text-foreground/80 leading-relaxed" style={{ fontFamily: 'var(--font-heading)' }}>
                                &ldquo;Our workshop is the heart where heritage meets contemporary soul.&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Right — Promise Cards 2×2 */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 content-start">
                        {promises.map((promise, index) => {
                            const Icon = promise.icon;
                            return (
                                <div key={index} className="group relative space-y-3 sm:space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                                    {/* Circular Image + Icon Badge */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
                                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
                                            <Image
                                                src={promise.image}
                                                alt={promise.title}
                                                fill
                                                sizes="112px"
                                                className="object-cover rounded-full group-hover:border-primary group-hover:scale-105 transition-transform duration-300 ease-out"
                                            />
                                        </div>
                                        {/* Icon Badge */}
                                        <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center">
                                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg sm:text-xl font-semibold italic text-foreground tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {promise.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground leading-relaxed font-normal tracking-wide max-w-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                                        {promise.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Quote */}
                <div className="text-center mt-14 sm:mt-18 md:mt-24">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="w-8 sm:w-12 h-px bg-linear-to-r from-transparent to-primary/40" />
                        <span className="w-1.5 h-1.5 rotate-45 bg-primary/40 rounded-sm" />
                        <span className="w-8 sm:w-12 h-px bg-linear-to-l from-transparent to-primary/40" />
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 italic font-semibold tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                        &ldquo;Every thread holds emotion, and every stitch tells a story&rdquo;
                    </p>
                </div>
            </div>

            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/3 via-transparent to-accent/3 pointer-events-none" />
        </section>
    );
}
