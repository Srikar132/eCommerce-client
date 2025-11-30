// components/cart/customers-also-bought.tsx
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cartProduct } from '@/lib/types';
import { ProductCard } from '@/components/cart/product-card';
import { Button } from '@/components/ui/button';
import gsap from "gsap";

interface CustomersAlsoBoughtProps {
    products: cartProduct[];
}

export const CustomersAlsoBought: React.FC<CustomersAlsoBoughtProps> = ({ products }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scrollAmount = 340;
        const currentScroll = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // Calculate target position with bounds checking
        const targetScroll = direction === 'left'
            ? Math.max(0, currentScroll - scrollAmount)
            : Math.min(maxScroll, currentScroll + scrollAmount);

        // Use GSAP for smooth animation
        gsap.to(container, {
            scrollLeft: targetScroll,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                // Update buttons after animation completes
                if (container) {
                    const { scrollLeft, scrollWidth, clientWidth } = container;
                    setShowLeft(scrollLeft > 10);
                    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
                }
            }
        });
    };

    return (
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t">
            <h2 className="lg:text-xl sm:text-base font-semibold mb-6 sm:mb-8 tracking-wider">Customers Also Bought</h2>
            <div className="relative">
                {showLeft && (
                    <Button
                        onClick={() => scroll('left')}
                        variant="outline"
                        size="icon"
                        className="hidden sm:flex absolute -left-5 top-1/3 z-10 h-10 w-10 rounded-full  bg-white shadow-lg hover:bg-gray-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}
                <div
                    ref={containerRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {showRight && (
                    <Button
                        onClick={() => scroll('right')}
                        variant="outline"
                        size="icon"
                        className="hidden sm:flex absolute -right-5 top-1/3 z-10 h-10 w-10 rounded-full border-red-500 cursor-pointer bg-white shadow-lg hover:bg-gray-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
};
