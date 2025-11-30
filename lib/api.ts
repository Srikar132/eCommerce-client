import { Category, Facets, ProductCard } from "./types";


const ensureAPIKey  = () : string => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
        throw new Error("API key is missing");
    }
    return apiKey;
};


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
}) :  Promise<{ items: ProductCard[]; total: number; page: number; size: number; facets: Facets }>=> {
    const { category, page = 1, size = 20, sort = 'relevance', filters = {} } = params;


    // const queryParams = new URLSearchParams({
    //     category,
    //     page: page.toString(),
    //     size: size.toString(),
    //     sort,
    //     ...Object.entries(filters).reduce((acc, [key, value]) => {
    //         acc[key] = value.toString();
    //         return acc;
    //     }, {} as Record<string, string>),
    // });

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
            facets: {
                brands: [ 'Sample Brand', 'Another Brand' ],
                sizes: [ 'S', 'M', 'L', 'XL' ],
                colors: [ 'Red', 'Blue', 'Green' ],
                priceRanges: [
                    { min: 0, max: 50 },
                    { min: 51, max: 100 },
                    { min: 101, max: 150 },
                ],
                
            },
        });
    });
}

/**
 * Fetch autocomplete suggestions for search
 * @param query - The search query string
 * @returns A promise that resolves to autocomplete suggestions
 */
export const fetchAutocomplete = async (query: string) => {
    // Mock data - replace with actual API call
    const mockSuggestions = [
        { text: "nike air max", count: 45 },
        { text: "nike jordan", count: 32 },
        { text: "nike dunk", count: 28 },
        { text: "adidas ultraboost", count: 22 },
        { text: "converse chuck taylor", count: 18 },
    ].filter(item => item.text.toLowerCase().includes(query.toLowerCase()));

    return new Promise<any[]>((resolve) => {
        setTimeout(() => resolve(mockSuggestions), 200);
    });
};

/**
 * Fetch search results for products
 * @param params - Search parameters including query, page, size
 * @returns A promise that resolves to search results
 */
export const fetchSearchResults = async (params: {
    q: string;
    page?: number;
    size?: number;
    filters?: Record<string, string | string[]>;
}) => {
    const { q, page = 1, size = 24, filters = {} } = params;

    // If no query, show all products; otherwise show search results
    const isAllProducts = !q || q.trim() === '';
    const productPrefix = isAllProducts ? 'Product' : `${q} Product`;
    const totalProducts = isAllProducts ? 500 : 120; // More products when showing all

    // Mock search results - replace with actual API call
    const fakeItems: any[] = Array.from({ length: size }).map((_, index) => ({
        id: `${isAllProducts ? 'all' : 'search'}-${(page - 1) * size + index + 1}`,
        name: `${productPrefix} ${(page - 1) * size + index + 1}`,
        slug: `${productPrefix.toLowerCase().replace(/\s+/g, '-')}-${(page - 1) * size + index + 1}`,
        brand: ['Nike', 'Adidas', 'Puma', 'Converse'][index % 4],
        price: Math.floor(Math.random() * 15000) + 2000,
        imageUrl: `/home/section4/img${(index % 4) + 1}.webp`,
        badge: index % 7 === 0 ? 'New' : undefined,
    }));

    return new Promise<any>((resolve) => {
        setTimeout(() => {
            resolve({
                items: fakeItems,
                total: totalProducts,
                page,
                size,
                query: q || 'all',
                facets: {
                    brands: ['Nike', 'Adidas', 'Puma', 'Converse'],
                    sizes: ['S', 'M', 'L', 'XL'],
                    colors: ['Red', 'Blue', 'Green'],
                    priceRanges: [
                        { min: 0, max: 50 },
                        { min: 51, max: 100 },
                        { min: 101, max: 150 },
                    ],
                },
            });
        }, 300);
    });
};

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
