import type { Metadata } from "next";
import Image from "next/image";
import ScrollingBanner from "@/components/landing-page/scrolling-banner";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";
import CustomButton from "@/components/ui/custom-button";

export const metadata: Metadata = {
    title: "About Us",
    description: "Discover the story of Nala Armoire - where dreams are stitched alive and memories are tenderly woven together.",
};

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background">


            {/* Section 3: The NaLa Story (Image 3 Style) */}
            <section className="mt-10">
                <div className="container relative mx-auto max-w-7xl">

                    <div className="w-full mb-10 md:mb-14">
                        <BreadcrumbNavigation />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start space-y-10">

                        {/* Left: Heading & Main Paragraph */}
                        <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-10">
                            <div className="space-y-4">
                                <p className="text-xs tracking-[0.2em] uppercase text-accent font-bold">
                                    Our Beginning
                                </p>
                                <h2 className="h1 !text-5xl">The NaLa Story</h2>
                            </div>

                            <p className="p-base text-muted-foreground leading-relaxed">
                                I&apos;ve always had a dream — a place where my talent could truly breathe.
                                With no clear path, I followed faith, trusting that the way would reveal itself.
                                That journey became <span className="text-foreground font-bold italic">NaLa Armoire</span>.
                            </p>

                            <div className="pt-6">
                                <CustomButton
                                    href="/products"
                                    bgColor="#000000"
                                    circleColor="#ffffff"
                                    textColor="#ffffff"
                                    textHoverColor="#000000"
                                >
                                    Shop Now
                                </CustomButton>
                            </div>
                        </div>

                        {/* Center: Image Grid */}
                        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/home/promise3.png"
                                    alt="Artisan Craftsmanship"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl">
                                <Image
                                    src="/images/home/promise4.png"
                                    alt="Embroidered Detail"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Right: Detailed Blocks */}
                        <div className="lg:col-span-4 space-y-16 lg:pt-12">
                            {/* Mission 1 */}
                            <div className="space-y-4">
                                <p className="text-sm font-black text-muted-foreground/30">01.</p>
                                <h3 className="h3 !text-2xl">Premium Quality</h3>
                                <p className="p-sm text-muted-foreground leading-relaxed">
                                    Every piece is crafted with meticulous attention to detail,
                                    using only the finest materials. We ensure that every thread
                                    meets our highest standards of excellence.
                                </p>
                            </div>

                            {/* Mission 2 */}
                            <div className="space-y-4">
                                <p className="text-sm font-black text-muted-foreground/30">02.</p>
                                <h3 className="h3 !text-2xl">Personal Touch</h3>
                                <p className="p-sm text-muted-foreground leading-relaxed">
                                    Your stories, your memories — we bring them to life through
                                    custom designs that reflect you. We tenderly knot your
                                    memories together through every stitch.
                                </p>
                            </div>

                            {/* Mission 3 */}
                            <div className="space-y-4">
                                <p className="text-sm font-black text-muted-foreground/30">03.</p>
                                <h3 className="h3 !text-2xl">Made With Love</h3>
                                <p className="p-sm text-muted-foreground leading-relaxed">
                                    Each stitch carries emotion, each creation is infused with
                                    passion and dedication. Because every thread holds emotion,
                                    and every stitch tells a story.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* Section 2: Our Mission (Image 2 Style) */}
            <section className="relative w-full py-32 bg-[#F0F7F7] overflow-hidden">
                {/* Floating Background Text */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <span className="text-[15vw] font-black whitespace-nowrap tracking-tighter">
                        OUR MISSION
                    </span>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center text-center">
                        {/* Circle Portraits */}
                        <div className="flex -space-x-4 mb-12">
                            {[1, 2].map((i) => (
                                <div key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white overflow-hidden shadow-xl relative">
                                    <Image
                                        src={`/images/home/slide-image${i}.webp`}
                                        alt="Artisan"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        <h2 className="h2 max-w-2xl mb-8">
                            A story of stitches, designed for your memories
                        </h2>

                        <div className="space-y-6 max-w-xl mx-auto">
                            <p className="p-base text-muted-foreground">
                                We believe clothing should feel as good as the memories it holds. That&apos;s why we focus on
                                thoughtful details, soft artisanal fabrics, and hand-stitched patterns made for life&apos;s most
                                meaningful moments.
                            </p>
                            <p className="p-sm text-muted-foreground/70 font-medium">
                                Each piece is created to support your journey, your imagination, and your joyful growing moments.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer Scrolling Banner */}
            <ScrollingBanner />
        </div>
    );
};

export default AboutPage;