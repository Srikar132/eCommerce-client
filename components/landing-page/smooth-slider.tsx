"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Instagram } from 'lucide-react';

interface SliderImage {
    id: string;
    imageUrl: string;
    altText: string | null;
}

interface SmoothSliderClientProps {
    images: SliderImage[];
}

const SmoothSliderClient = ({ images }: SmoothSliderClientProps) => {
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate posts for seamless loop
    const duplicatedPosts = [...images, ...images];

    if (images.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-background">

            <div className="relative text-center section-header">
                <p className="p-inline">
                    Join Us
                </p>
                <h1 className='font-bold'>
                    @THE-NALA-ARMOIRE
                </h1>
                {/* <p className="text-sm sm:text-base md:text-lg text-muted-foreground tracking-wide p-inline">
          Handpicked collections for everyone
        </p> */}
            </div>

            {/* Marquee Container */}
            <div className="relative overflow-hidden">
                <div
                    className="flex gap-2"
                    style={{
                        animation: 'marquee 30s linear infinite',
                        animationPlayState: isPaused ? 'paused' : 'running',
                        width: 'max-content'
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {duplicatedPosts.map((post, index) => (
                        <div
                            key={`${post.id}-${index}`}
                            className="shrink-0 w-52 sm:w-56 md:w-72 lg:w-80 h-64 sm:h-72 md:h-80 lg:h-96 relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card"
                        >
                            <Image
                                src={post.imageUrl}
                                alt={post.altText || 'Fashion image'}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                width={320}
                                height={400}
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Follow Button */}
            <div className="text-center mt-12">
                <Link
                    href="https://www.instagram.com/nala_armoire/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm sm:text-base font-medium uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                    <span>Follow Us</span>
                    <Instagram />
                </Link>
            </div>

            {/* Decorative Gradient Blobs */}
            <div className="absolute top-10 left-0 w-75 h-75 bg-accent/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-10 right-0 w-87.5 h-75 bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </section>
    );
};

export default SmoothSliderClient;