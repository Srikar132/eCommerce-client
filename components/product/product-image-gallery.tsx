"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils/utils";
import ImageZoomModal from "./image-zoom-modal";
import { Button } from "../ui/button";


interface ProductImageGalleryProps {
    images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);


    if (!images || images.length === 0) {
        return (
            <div className="pdp-image-gallery">
                <div className="pdp-no-image">No images available</div>
            </div>
        );
    }

    return (
        <div className={cn(
            "pdp-image-gallery",
        )}>
            {/* Thumbnail Column */}
            <div className="pdp-thumbnails">
                {images.map((image, index) => (
                    <Button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`pdp-thumbnail ${selectedImageIndex === index ? "pdp-thumbnail-active" : ""
                            }`}
                    >

                        <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </Button>
                ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="pdp-main-image relative">
                <ImageZoomModal
                    image={images[selectedImageIndex]}
                />
            </div> *
        </div>
    );
}