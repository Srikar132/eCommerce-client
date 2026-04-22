import CategoryCard from '@/components/cards/category-card';
import { getActiveCategories } from '@/lib/actions/product-actions';

export default async function ShopByCategories() {
    // Handle data fetching outside of render logic to avoid try/catch JSX violation
    const categories = await getActiveCategories().catch((error) => {
        console.error("Failed to fetch categories:", error);
        return [];
    });

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="section bg-white relative   z-30 rounded-t-[20px] lg:rounded-t-[60px] -mt-12">
            <div className="container mb-16">
                <span className="text-[11px] font-bold tracking-[0.35em] text-black/30 uppercase mb-4 block">
                    Our Collections
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black">
                    Shop by Category
                </h2>
            </div>

            <div className="container">
                {/* Horizontal Uniform Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {categories.map((category) => (
                        <div key={category.id}>
                            <CategoryCard
                                title={category.name}
                                image={category.imageUrl || ""}
                                url={`/products?category=${category.slug}`}
                                className="aspect-[4/5]"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}