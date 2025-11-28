import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import {featuredCards} from "@/lib/types";

const posts: featuredCards[] = [
    { id: 1, image: "/home/section11/image1.png", alt: "Fashion post 1" },
    { id: 2, image: "/home/section11/image8.png", alt: "Fashion post 2" },
    { id: 3, image: "/home/section11/image7.png", alt: "Fashion post 3" },
    { id: 4, image: "/home/section11/image4.png", alt: "Fashion post 4" },
    { id: 5, image: "/home/section11/image5.png", alt: "Fashion post 5" },
    { id: 6, image: "/home/section11/image6.png", alt: "Fashion post 6" },
];

const SmoothSlider = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);


    const duplicatedPosts = [...posts, ...posts , ...posts];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollSpeed = 1;
        const singleSetWidth = (scrollContainer.scrollWidth / 2);

        const animate = () => {
            if (!isPaused && scrollContainer) {
                // Continue from current scroll position
                let currentPosition = scrollContainer.scrollLeft;
                currentPosition += scrollSpeed;

                if (currentPosition >= singleSetWidth) {
                    currentPosition = 0;
                }

                scrollContainer.scrollLeft = currentPosition;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused]);

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <section className="w-full py-10 px-4 overflow-hidden bg-white">
            <div className="text-center mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Join Us</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide">
                    @THE-NALA-ALMORIE
                </h2>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-hidden will-change-scroll"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    scrollBehavior: 'auto',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {duplicatedPosts.map((post, index) => (
                    <div
                        key={`${post.id}-${index}`}
                        className="shrink-0 w-52 sm:w-56 md:w-72 lg:w-80 h-64 sm:h-72 md:h-80 lg:h-96 relative group cursor-pointer overflow-hidden"
                    >
                        <Image
                            src={post.image}
                            alt={post.alt}
                            width={500}
                            height={400}
                            className="w-full h-full object-cover"
                            priority={index < 6}
                        />
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <a
                    href="https://instagram.com/the-nala-almorie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-b-2 border-gray-900 text-gray-900 font-medium pb-1 hover:opacity-70 transition-all"
                >
                    Follow Us
                </a>
            </div>
        </section>
    );
};

export default SmoothSlider;