"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handlePrevious = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full">
                <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                        <div className="text-muted-foreground text-center">
                            <p className="text-lg">No images available</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Main Image Container with Navigation */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted group">
                {!!images[selectedImageIndex]?.imageUrl ? (
                    <Image
                        src={images[selectedImageIndex].imageUrl}
                        alt={images[selectedImageIndex].altText || `Product Image ${selectedImageIndex + 1}`}
                        fill
                        className="object-contain p-4 md:p-8"
                        priority={selectedImageIndex === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    />
                ) : (
                    <Image
                        src="/images/image-not-found.webp"
                        alt="Image not found"
                        fill
                        className="object-contain p-4 md:p-8"
                    />
                )}

                {/* Navigation Arrows - Only show if multiple images */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                    {images.filter(image => image.imageUrl).map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={cn(
                                "relative aspect-square rounded-lg overflow-hidden transition-all cursor-pointer bg-muted",
                                selectedImageIndex === index
                                    ? "ring-2 ring-primary ring-offset-2"
                                    : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
                            )}
                        >
                            <Image
                                src={image.imageUrl!}
                                alt={image.altText || `Product Image ${index + 1}`}
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 768px) 25vw, 100px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}