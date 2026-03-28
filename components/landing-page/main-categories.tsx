import Image from 'next/image';
import CategoryCard from '@/components/cards/category-card';
import { getActiveLandingCategories } from '@/lib/actions/content-actions';

export default async function ShopByCategories() {
    const categories = await getActiveLandingCategories();
    return (
        <section className="section">

            {/* Section Header */}
            <div className="relative text-center section-header">
                <p className="p-inline">
                    Explore Collections
                </p>
                <h2>
                    Shop by Category
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground tracking-wide p-inline">
                    Handpicked collections for everyone
                </p>
            </div>

            <div className="container">


                {/* Categories Grid */}
                <div className="relative flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-12px)]">
                            <CategoryCard
                                id={category.id}
                                title={category.title}
                                image={category.imageUrl}
                                url={category.linkUrl}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom Tagline */}
                <div className="text-center mt-12">
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground p-inline">
                        Every piece tells a story, every stitch crafted with love
                    </p>
                </div>
            </div>

        </section>
    );
}