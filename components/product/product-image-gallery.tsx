// src/components/product/ProductImageGallery.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";

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
        <div className="pdp-image-gallery">
            {/* Thumbnail Column */}
            <div className="pdp-thumbnails">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`pdp-thumbnail ${
                            selectedImageIndex === index ? "pdp-thumbnail-active" : ""
                        }`}
                    >

                        <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="pdp-main-image">
                <Image
                    src={images[selectedImageIndex].url}
                    alt={images[selectedImageIndex].alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </div>
    );
}