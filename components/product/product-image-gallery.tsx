"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";
import { Search } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import ImageZoomModal from "./image-zoom-modal";

interface ProductImageGalleryProps {
    images: ProductImage[];
    productName?: string;
    productSlug?: string;
}

export default function ProductImageGallery({
    images,
    productName,
}: ProductImageGalleryProps) {
    const [zoomImage, setZoomImage] = useState<{ id: string; url: string; alt: string } | null>(null);

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-[3/4] bg-muted/20 rounded-[32px] flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    const scrollToImage = (id: string) => {
        const element = document.getElementById(`image-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="w-full">
            <div className="flex gap-6">
                {/* Desktop Thumbnails Sidebar */}
                <div className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit min-w-[80px]">
                    {images.map((image, index) => (
                        <button
                            key={`thumb-${image.id}`}
                            onClick={() => scrollToImage(image.id)}
                            className="relative w-20 aspect-[3/4] rounded-2xl overflow-hidden bg-muted hover:ring-2 hover:ring-accent transition-all group"
                        >
                            <Image
                                src={image.imageUrl}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>

                {/* Desktop: Vertical Stack of Images */}
                <div className="hidden lg:flex flex-col gap-8 flex-1">
                    {images.map((image, index) => (
                        <div
                            id={`image-${image.id}`}
                            key={image.id}
                            className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden bg-muted group"
                        >
                            <Image
                                src={image.imageUrl}
                                alt={image.altText || productName || `Product image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority={index === 0}
                                sizes="(min-width: 1024px) 60vw, 1000px"
                            />

                            {/* Zoom Button - Clickable trigger */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomImage({
                                        id: image.id,
                                        url: image.imageUrl,
                                        alt: image.altText || productName || `Product image ${index + 1}`
                                    });
                                }}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-white hover:scale-110 active:scale-95"
                                aria-label="Zoom image"
                            >
                                <Search size={20} strokeWidth={1.5} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile: Carousel */}
            <div className="lg:hidden relative group">
                <Carousel className="w-full">
                    <CarouselContent>
                        {images.map((image, index) => (
                            <CarouselItem key={image.id}>
                                <div className="relative aspect-[3/4] w-full rounded-[32px] overflow-hidden bg-muted">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.altText || productName || `Product image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        sizes="100vw"
                                    />

                                    {/* Mobile Zoom Trigger */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setZoomImage({
                                                id: image.id,
                                                url: image.imageUrl,
                                                alt: image.altText || productName || `Product image ${index + 1}`
                                            });
                                        }}
                                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground shadow-sm z-10 active:scale-90 transition-transform"
                                        aria-label="Zoom image"
                                    >
                                        <Search size={18} strokeWidth={1.5} />
                                    </button>

                                    {/* Mobile Indicator */}
                                    <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold">
                                        {index + 1} / {images.length}
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Arrows for Mobile Prompting */}
                    {images.length > 1 && (
                        <>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                <CarouselPrevious className="relative left-0 translate-y-0 w-10 h-10 border-none bg-white/40 backdrop-blur-sm text-foreground hover:bg-white/60 transition-colors" />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                                <CarouselNext className="relative right-0 translate-y-0 w-10 h-10 border-none bg-white/40 backdrop-blur-sm text-foreground hover:bg-white/60 transition-colors" />
                            </div>
                        </>
                    )}
                </Carousel>
            </div>

            {/* Zoom Modal */}
            {zoomImage && (
                <ImageZoomModal
                    image={zoomImage}
                    onClose={() => setZoomImage(null)}
                />
            )}
        </div>
    );
}