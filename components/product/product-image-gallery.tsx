"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageZoomModal from "./image-zoom-modal";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

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
            <div className="w-full p-3 sm:p-4">
                <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '125%' }}>
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <div className="text-muted-foreground text-center">
                            <p className="text-lg">No images available</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handlePrevious = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-3 p-3 sm:p-4">
                {/* Main Image Container with 4:5 Aspect Ratio for better proportion */}
                <div className="relative w-full rounded-xl overflow-hidden bg-muted group" style={{ paddingBottom: '125%' }}>
                    {/* Main Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={images[selectedImageIndex].url}
                            alt={images[selectedImageIndex].alt}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                            priority={selectedImageIndex === 0}
                            quality={85}
                        />
                    </div>

                    {/* Zoom Button Overlay */}
                    <button
                        onClick={() => setIsZoomOpen(true)}
                        className="absolute top-2 right-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110 shadow-md z-10"
                        aria-label="Zoom image"
                    >
                        <ZoomIn className="h-4 w-4 text-foreground" />
                    </button>

                    {/* Navigation Arrows (only show if more than 1 image) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110 shadow-md z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-4 w-4 text-foreground" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110 shadow-md z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-4 w-4 text-foreground" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-lg text-xs font-medium text-foreground shadow-md">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {images.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => setSelectedImageIndex(index)}
                                className={cn(
                                    "relative w-full rounded-md overflow-hidden border-2 transition-all duration-200",
                                    selectedImageIndex === index
                                        ? "border-primary ring-2 ring-primary/20 scale-105"
                                        : "border-border hover:border-primary/50 hover:scale-105"
                                )}
                                style={{ paddingBottom: '125%' }}
                            >
                                <div className="absolute inset-0">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-contain"
                                        sizes="80px"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

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