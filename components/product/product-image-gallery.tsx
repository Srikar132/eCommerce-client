"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageZoomModal from "./image-zoom-modal";

interface ProductImage {
    id: string;
    url: string;
    alt: string;
}

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full">
                <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <div className="text-slate-400 text-center">
                            <p className="text-lg">No images available</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Main Image Container */}
            <div className="relative w-full group max-h-[700px] h-[700px] overflow-hidden rounded-lg">
                <Image
                    src={images[selectedImageIndex].url}
                    alt={images[selectedImageIndex].alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                    priority={selectedImageIndex === 0}
                    quality={90}
                />

                {/* Image Indicator Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    selectedImageIndex === index
                                        ? "bg-primary"
                                        : "bg-slate-300 dark:bg-slate-700"
                                )}
                                aria-label={`View image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Zoom Overlay */}
                <div 
                    onClick={() => setIsZoomOpen(true)}
                    className="zoom-overlay opacity-0 absolute inset-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center bg-black/5 cursor-pointer group-hover:pointer-events-auto group-hover:opacity-100 z-10"
                >
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur p-4 rounded-full">
                        <span className="material-icons-outlined text-slate-900 dark:text-white">zoom_in</span>
                    </div>
                </div>
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {images.slice(0, 4).map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={cn(
                                "aspect-square rounded-xl overflow-hidden transition-all cursor-pointer",
                                selectedImageIndex === index
                                    ? "border-2 border-primary"
                                    : "border border-slate-100 dark:border-slate-800 hover:border-primary"
                            )}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                />
                                {index === 3 && images.length > 4 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-black/50">
                                        +{images.length - 4} More
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Zoom Modal */}
            {isZoomOpen && (
                <ImageZoomModal
                    image={images[selectedImageIndex]}
                    onClose={() => setIsZoomOpen(false)}
                />
            )}
        </div>
    );
}