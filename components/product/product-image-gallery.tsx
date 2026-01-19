"use client";

import  { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageZoomModal from "./image-zoom-modal";
import { Button } from "../ui/button";


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


    if (!images || images.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                <div className="text-muted-foreground text-center">
                    <p className="text-lg">No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col-reverse sm:flex-row gap-4 p-4">
            {/* Thumbnail Column */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] pb-2 sm:pb-0">
                {images.map((image, index) => (
                    <Button
                        key={image.id}
                        variant="ghost"
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                            "relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 p-0 overflow-hidden rounded-md border-2 transition-all duration-200",
                            selectedImageIndex === index 
                                ? "border-primary shadow-md" 
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 80px, 96px"
                        />
                    </Button>
                ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="flex-1 relative rounded-lg overflow-hidden bg-muted">
                <ImageZoomModal
                    image={images[selectedImageIndex]}
                />
            </div>
        </div>
    );
}