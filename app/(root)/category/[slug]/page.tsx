import CategoryClient from "@/components/category-client";
import { fetchCategoryBySlug, fetchProductsByCategory } from "@/lib/api";



type Props = {
    params: { slug: string };
    searchParams: Record<string, string | string[] | undefined>;
};

export const revalidate = 60;

// change metadata based on slug
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;

    const category = await fetchCategoryBySlug(slug);

    if (!category) {
        return {
            title: "Category not found",
            description: "The requested category could not be found.",
        };
    }

    return {
        title: category.name,
        description: category.description,
    };
}

export default async function CategoryPage({ params , searchParams }: Props) {
    const { slug } =  await params;
    const { page , sort , size , ...rest} = await searchParams;

    // Fetch category details
    const [categoryData, productsData] = await Promise.all([
        fetchCategoryBySlug(slug),
        fetchProductsByCategory({
            category: slug,
            page: typeof page === 'string' ? parseInt(page) : 1,
            size: typeof size === 'string' ? parseInt(size) : 20,
            sort: typeof sort === 'string' ? sort : 'relevance',
            filters: rest as Record<string, string>,
        }),
    ]);


    return (
        <div id="category-container">
            <header className="category-header">
                <h1>{categoryData.name}</h1>
                {categoryData.description && (
                    <p>{categoryData.description}</p>
                )}
            </header>

            <CategoryClient
                slug={slug}
                initialCategory={categoryData}
                initialProducts={productsData.items}
                initialTotal={productsData.total}
                initialPage={productsData.page}
                initialSize={productsData.size}
                initialFacets={productsData.facets}
            />
        </div>
    );
}