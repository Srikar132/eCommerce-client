

import Image from "next/image";
import Link from "next/link";

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
                        Our Journey
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium italic tracking-tight text-foreground mb-6">
                        About Us
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground italic max-w-2xl mx-auto">
                        Where dreams are stitched alive, and memories are tenderly woven together
                    </p>
                </div>

                {/* Decorative Gradient Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-lg sm:h-128 bg-primary/5 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />
            </section>

            {/* The NaLa Story Section */}
            <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-4xl mx-auto">

                    {/* Section Header */}
                    <div className="text-center mb-12 sm:mb-16 space-y-3">
                        <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                            Our Beginning
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
                            The NaLa Story
                        </h2>
                    </div>

                    {/* Story Content */}
                    <div className="space-y-8 text-center">
                        <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed">
                            I've always had a dream — a place where my talent could truly breathe. With no clear path, I followed faith, trusting that the way would reveal itself.
                        </p>

                        <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed">
                            That journey became <span className="font-medium italic text-foreground">NaLa Armoire</span>: a little world where my dreams are stitched alive, and where I can also tenderly knot your memories together through stitches.
                        </p>

                        <div className="pt-4">
                            <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed">
                                Because every thread holds emotion,<br className="hidden sm:block" /> and every stitch tells a story.
                            </p>
                        </div>
                    </div>

                    {/* Decorative Flowers */}
                    <div className="absolute top-20 left-[5%] w-16 h-16 sm:w-24 sm:h-24 opacity-30 pointer-events-none">
                        <Image
                            src="/images/home/flower2.webp"
                            alt=""
                            fill
                            sizes="(max-width: 640px) 64px, 96px"
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>
                    <div className="absolute bottom-20 right-[5%] w-20 h-20 sm:w-28 sm:h-28 opacity-30 pointer-events-none">
                        <Image
                            src="/images/home/flower3.webp"
                            alt=""
                            fill
                            sizes="(max-width: 640px) 80px, 112px"
                            className="object-contain select-none"
                            draggable={false}
                        />
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-6xl mx-auto">

                    {/* Section Header */}
                    <div className="text-center mb-12 sm:mb-16 space-y-3">
                        <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                            What We Stand For
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
                            Our Mission
                        </h2>
                    </div>

                    {/* Mission Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

                        {/* Card 1 - Quality */}
                        <div className="group relative bg-background p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-border/50">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-medium text-foreground">Premium Quality</h3>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    Every piece is crafted with meticulous attention to detail, using only the finest materials.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 - Personalization */}
                        <div className="group relative bg-background p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-border/50">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-medium text-foreground">Personal Touch</h3>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    Your stories, your memories — we bring them to life through custom designs that reflect you.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 - Love */}
                        <div className="group relative bg-background p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-border/50">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-medium text-foreground">Made With Love</h3>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    Each stitch carries emotion, each creation is infused with passion and dedication.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium italic tracking-tight text-foreground">
                        Let's Stitch Your Story Together
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                        Explore our collections and discover pieces that speak to your soul
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link
                            href="/products"
                            className="inline-block bg-primary text-primary-foreground px-8 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-block bg-background text-foreground border-2 border-border px-8 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-medium hover:bg-muted transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* Decorative Gradient Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-lg sm:h-128 bg-primary/5 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />
            </section>
        </div>
    );
}

export default About;
