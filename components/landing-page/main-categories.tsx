
import Image from 'next/image';
import { categories } from '@/constants';
import CategoryCard from '@/components/cards/category-card';

export default function ShopByCategories() {
    return (
        <section className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 bg-background overflow-hidden">
            
            {/* Decorative Flowers - Top Corners */}
            {/* Top Left Corner */}
            <div className="absolute top-8 left-4 sm:left-8 lg:left-12 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-50 pointer-events-none z-10">
                <Image
                    src="/images/home/flower2.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Top Right Corner */}
            <div className="absolute top-12 right-4 sm:right-8 lg:right-12 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 opacity-45 pointer-events-none z-10">
                <Image
                    src="/images/home/flower5.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
                    className="object-contain select-none scale-150"
                    draggable={false}
                />
            </div>

            {/* Left Side Middle */}
            <div className="absolute top-1/3 left-0 sm:left-4 w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 opacity-40 pointer-events-none z-10 hidden sm:block">
                <Image
                    src="/images/home/flower4.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 144px, 176px"
                    className="object-contain select-none scale-150"
                    draggable={false}
                />
            </div>

            {/* Right Side Middle */}
            <div className="absolute top-1/2 right-0 sm:right-4 w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 opacity-45 pointer-events-none z-10 hidden sm:block">
                <Image
                    src="/images/home/flower3.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 192px"
                    className="object-cover select-none scale-150"
                    draggable={false}
                />
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-16 left-8 sm:left-12 lg:left-16 w-20 h-20 sm:w-28 sm:h-28 opacity-35 pointer-events-none z-10 hidden md:block">
                <Image
                    src="/images/home/flower6.webp"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 80px, 112px"
                    className="object-cover select-none scale-150"
                    draggable={false}
                />
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-20 right-8 sm:right-16 lg:right-20 w-16 h-16 sm:w-24 sm:h-24 opacity-40 pointer-events-none z-10 hidden md:block">
                <Image
                    src="/images/home/flower2.webp"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 64px, 96px"
                    className="object-contain select-none"
                    draggable={false}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                
                {/* Section Header */}
                <div className="relative text-center mb-12 sm:mb-16 space-y-3">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-tight text-foreground">
                        Shop by Category
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground italic tracking-wide">
                        Explore our handpicked collections for everyone
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            id={category.id}
                            title={category.title}
                            image={category.image}
                            url={category.url}
                        />
                    ))}
                </div>

                {/* Bottom Tagline */}
                <div className="relative text-center mt-12 sm:mt-16">
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground italic">
                        Every piece tells a story, every stitch crafted with love
                    </p>
                </div>

            </div>

        </section>
    );
}