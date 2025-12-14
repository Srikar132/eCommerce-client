import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const posts = [
    { id: 1, image: "/home/section11/image1.png", alt: "Fashion post 1" },
    { id: 2, image: "/home/section11/image8.png", alt: "Fashion post 2" },
    { id: 3, image: "/home/section11/image7.png", alt: "Fashion post 3" },
    { id: 4, image: "/home/section11/image4.png", alt: "Fashion post 4" },
    { id: 5, image: "/home/section11/image5.png", alt: "Fashion post 5" },
    { id: 6, image: "/home/section11/image6.png", alt: "Fashion post 6" },
];

const SmoothSlider = () => {
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate posts for seamless loop
    const duplicatedPosts = [...posts, ...posts];

    return (
        <section className="w-full py-10 px-4 overflow-hidden bg-white">
            <div className="text-center mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Join Us</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide">
                    @THE-NALA-ALMORIE
                </h2>
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
                            className="shrink-0 w-52 sm:w-56 md:w-72 lg:w-80 h-64 sm:h-72 md:h-80 lg:h-96 relative group cursor-pointer overflow-hidden"
                        >
                            <Image
                                src={post.image}
                                alt={post.alt}
                                className="w-full h-full object-cover"
                                width={320}
                                height={400}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-8">
                <Link
                    href="https://instagram.com/the-nala-almorie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-b-2 border-gray-900 text-gray-900 font-medium pb-1 hover:opacity-70 transition-all"
                >
                    Follow Us
                </Link>
            </div>

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