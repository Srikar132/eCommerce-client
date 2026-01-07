import { useState } from 'react';
import Image from 'next/image';
import { categories } from '@/constants';


const MCategories = () => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

   

    const displayCategories = categories;

    return (
        <section className="w-full py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                    Shop By Category
                </h2>
                <p className="text-gray-600 text-lg">Discover your perfect style</p>
            </div>

            {/* 3-Column Bento Grid - Dynamic Heights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                {/* Men - Large Left Card (spans 5 columns, taller) */}
                <div 
                    className="md:col-span-5 relative group overflow-hidden rounded-2xl cursor-pointer h-[500px] md:h-[600px]"
                    onMouseEnter={() => setHoveredId(displayCategories[0].id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 z-10 group-hover:from-black/30 group-hover:to-black/80 transition-all duration-500" />
                    <Image
                        src={displayCategories[0].image}
                        alt={displayCategories[0].title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                        <h3 className="text-white text-4xl md:text-5xl font-bold mb-3 transform group-hover:translate-y-[-8px] transition-transform duration-300">
                            {displayCategories[0].title}
                        </h3>
                        <p className="text-white/90 text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            Explore Men's Collection →
                        </p>
                    </div>
                </div>

                {/* Right Column - Women & Kids Stacked */}
                <div className="md:col-span-7 grid grid-rows-2 gap-4 md:gap-6">
                    {/* Women - Top Card */}
                    <div 
                        className="relative group overflow-hidden rounded-2xl cursor-pointer h-[400px] md:h-full"
                        onMouseEnter={() => setHoveredId(displayCategories[1].id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 z-10 group-hover:from-black/30 group-hover:to-black/80 transition-all duration-500" />
                        <Image
                            src={displayCategories[1].image}
                            alt={displayCategories[1].title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                            <h3 className="text-white text-3xl md:text-4xl font-bold mb-2 transform group-hover:translate-y-[-8px] transition-transform duration-300">
                                {displayCategories[1].title}
                            </h3>
                            <p className="text-white/90 text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                Explore Women's Collection →
                            </p>
                        </div>
                    </div>

                    {/* Kids - Bottom Card */}
                    <div 
                        className="relative group overflow-hidden rounded-2xl cursor-pointer h-[400px] md:h-full"
                        onMouseEnter={() => setHoveredId(displayCategories[2].id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 z-10 group-hover:from-black/30 group-hover:to-black/80 transition-all duration-500" />
                        <Image
                            src={displayCategories[2].image}
                            alt={displayCategories[2].title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                            <h3 className="text-white text-3xl md:text-4xl font-bold mb-2 transform group-hover:translate-y-[-8px] transition-transform duration-300">
                                {displayCategories[2].title}
                            </h3>
                            <p className="text-white/90 text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-group-hover:translate-y-0 transition-all duration-300">
                                Explore Kids' Collection →
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Demo Component
export default function CategoryDemo() {
    return (
        <div className="min-h-screen bg-gray-50">
            <MCategories />
        </div>
    );
}