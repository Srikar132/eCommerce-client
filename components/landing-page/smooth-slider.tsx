"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { instagramURI, sliderImage } from '@/constants';


const SmoothSlider = () => {
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate posts for seamless loop
    const duplicatedPosts = [...sliderImage, ...sliderImage];

    return (
        <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
            
            {/* Section Header */}
            <div className="text-center mb-12 space-y-3">
                <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                    Join Us
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
                    @THE-NALA-ARMOIRE
                </h2>
            </div>

            {/* Marquee Container */}
            <div className="relative overflow-hidden">
                <div
                    className="flex gap-4 sm:gap-6"
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
                            className="shrink-0 w-52 sm:w-56 md:w-72 lg:w-80 h-64 sm:h-72 md:h-80 lg:h-96 relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card"
                        >
                            <Image
                                src={post.image}
                                alt={post.alt}
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
                    href={instagramURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm sm:text-base font-medium uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                    <span>Follow Us</span>
                    <svg 
                        className="w-5 h-5" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
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

export default SmoothSlider;