import { Category, Facets, ProductCard } from "./types";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';


/**
 * Fetch category details by slug from the API.
 * @param slug - The slug of the category to fetch.
 * @returns A promise that resolves to the category details.
 */
export const fetchCategoryBySlug = async (slug: string) => {
    return new Promise<Category>(async (resolve, _reject) => {
        resolve({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: slug,
            slug: slug,
            description: 'This is a sample category fetched by slug.',
            metadata: {
                popularity: 'high',
            },
        });
    });
};

/**
 * Fetch products for a given category with pagination, sorting, and filtering.
 * Request: {category, page, size, sort, filters?}
 * Server response expected:
 * {
 *   items: ProductCard[],
 *   total: number,
 *   page: number,
 *   size: number,
 *   facets?: Facets
 * }
 */
export const fetchProductsByCategory = async (params: {
    category: string;
    page?: number;
    size?: number;
    sort?: string;
    filters?: Record<string, string | string[] | boolean>;
    rawQuery?: Record<string, string | string[] | undefined>;
}) :  Promise<{ items: ProductCard[]; total: number; page: number; size: number; facets: Facets }>=> {
    const { category, page = 1, size = 20, sort = 'relevance', filters = {} } = params;
    const queryParams = new URLSearchParams({
        category,
        page: page.toString(),
        size: size.toString(),
        sort,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
            acc[key] = value.toString();
            return acc;
        }, {} as Record<string, string>),
    });

    const fakeItems : ProductCard[] = Array.from({ length: size }).map((_, index) => ({
        id: `prod-${(page - 1) * size + index + 1}`,
        name: `Product ${(page - 1) * size + index + 1}`,
        slug: `product-${(page - 1) * size + index + 1}`,
        brand: 'Sample Brand',
        price: Math.floor(Math.random() * 10000) + 1000,
        imageUrl: `/home/section4/img${(index ) % 4 + 1}.webp`,
        badge: index % 5 === 0 ? 'Best Seller' : undefined,
    }));


    return new Promise<any>(async (resolve, reject) => {
        resolve({
            items: fakeItems,
            total: fakeItems.length,
            page,
            size,
        });
    });
}

/**
 * Fetch product details by ID from the API.
 * @param id - The ID of the product to fetch.
 * 
 * @returns A promise that resolves to the product details.
 */
export const fetchProductById = async (id: string) => {
    return new Promise<ProductCard>(async (resolve, reject) => {
        resolve({
            id,
            name: 'Sample Product',
            slug: 'sample-product',
            brand: 'Sample Brand',
            price: 1999,
            imageUrl: '/placeholder-product.jpg',
            badge: 'New Arrival',
        });
    });
}
