import Image from 'next/image';
import CategoryCard from '@/components/cards/category-card';
import { getActiveLandingCategories } from '@/lib/actions/content-actions';

export default async function ShopByCategories() {
    try {
        const categories = await getActiveLandingCategories();
        return (
            <section className="section z-30 bg-background rounded-t-3xl -mt-1 sm:-mt-2 md:-mt-3">                {/* Section Header */}
    
                <div className="section-header">
                    <h2 className='font-bold!'>
                        Shop by Category
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground tracking-wide p-inline">
                        Handpicked collections for everyone
                    </p>
                </div>
    
                <div className='container'>
                    {/* Categories Grid */}
                    <div className="relative flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-4">
                        {categories.map((category) => (
                            <div key={category.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-30px)]">
                                <CategoryCard
                                    id={category.id}
                                    title={category.title}
                                    image={category.imageUrl}
                                    url={category.linkUrl}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );

    } catch(error) {
        return null;
    }
}