"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types/product";



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
            <div className="relative w-full group max-h-175 h-175 overflow-hidden">

                {!!images[selectedImageIndex]?.imageUrl ? (
                    <Image
                        src={images[selectedImageIndex].imageUrl}
                        alt={images[selectedImageIndex].altText || `Product Image ${selectedImageIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <Image
                        src="/images/image-not-found.webp"
                        alt="Image not found"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                )}

            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {images.filter(image => image.imageUrl).slice(0, 4).map((image, index) => (
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
                                    src={image.imageUrl!}
                                    alt={image.altText || `Product Image ${index + 1}`}
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

        </div>
    );
}