import { 
    FetchProductList, 
    ProductSearchResponse, 
    ProductDetail,
    ProductReviewsResponse,
    AddReviewRequest,
    AddReviewResponse,
    PagedResponse,
    Design
} from "@/types";
import { apiClient } from "./client";
import { AxiosResponse } from "axios";
import { buildParams } from "../utils";



export const productApi = {
    /**
     * GET /api/v1/products
     * Search and filter products with multiple criteria
     * 
     * Query parameters:
     * - category: Array of category slugs
     * - brand: Array of brand slugs
     * - minPrice, maxPrice: Price range filters
     * - size: Array of sizes (S, M, L, XL)
     * - color: Array of color names
     * - customizable: Boolean filter
     * - page: Page number (0-based)
     * - size: Items per page
     * - sort: Sort format (e.g., "createdAt,desc")
     */
    getProducts: async ({
        filters,
        page = 0,
        size = 24,
        sort = 'createdAt,desc'
    }: FetchProductList): Promise<ProductSearchResponse> => {

        console.log('Fetching products with params:', { filters });

        const params = {
            page,
            size,
            sort,
            ...filters, // Spread filters directly
        };

        const queryString = buildParams(params);
        console.log('Query string:', queryString);
        console.log('Full URL:', `/api/v1/products?${queryString}`);
        
        const res: AxiosResponse<ProductSearchResponse> = await apiClient.get(
            `/api/v1/products?${queryString}`
        );

        // console.log('API Response:', res.data);
        // console.log(`Fetched ${res.data.products.content.length} products`);

        return res.data;
    },

    /**
     * GET /api/v1/products/autocomplete
     * Returns search suggestions based on query
     * 
     * @param query - Search query string
     * @param limit - Maximum number of suggestions (default: 5)
     */
    fetchAutocomplete: async (query: string, limit: number = 5): Promise<string[]> => {
        const { data } = await apiClient.get<string[]>(
            `/api/v1/products/autocomplete`,
            { params: { query, limit } }
        );
        return data;
    },

    /**
     * GET /api/v1/products/{slug}
     * Get single product by slug with full details
     * 
     * @param slug - Product slug identifier
     */
    getProductBySlug: async (slug: string): Promise<ProductDetail> => {
        const { data } = await apiClient.get<ProductDetail>(
            `/api/v1/products/${slug}`
        );
        return data;
    },

    // /**
    //  * GET /api/v1/products/{slug}/variants
    //  * Get all variants for a specific product
    //  * 
    //  * @param slug - Product slug identifier
    //  */
    // getProductVariants: async (slug: string): Promise<ProductVariant[]> => {
    //     const { data } = await apiClient.get<ProductVariant[]>(
    //         `/api/v1/products/${slug}/variants`
    //     );
    //     return data;
    // },

    /**
     * GET /api/v1/products/{slug}/reviews
     * Get paginated reviews for a product
     * 
     * @param slug - Product slug identifier
     * @param page - Page number (default: 0)
     * @param size - Items per page (default: 10)
     * @param sort - Sort format (default: "createdAt,desc")
     */
    getProductReviews: async (
        slug: string, 
        page: number = 0, 
        size: number = 10,
        sort: string = 'createdAt,desc'
    ): Promise<ProductReviewsResponse> => {
        const { data } = await apiClient.get<ProductReviewsResponse>(
            `/api/v1/products/${slug}/reviews`,
            { params: { page, size, sort } }
        );
        return data;
    },

    /**
     * POST /api/v1/products/{slug}/reviews
     * Add a review to a product (authenticated users only)
     * 
     * @param slug - Product slug identifier
     * @param reviewData - Review data including rating, title, comment, etc.
     */
    addProductReview: async (
        slug: string, 
        reviewData: AddReviewRequest
    ): Promise<AddReviewResponse> => {
        const { data } = await apiClient.post<AddReviewResponse>(
            `/api/v1/products/${slug}/reviews`,
            reviewData
        );
        return data;
    },

    /**
     * GET /api/v1/products/{slug}/designs
     * Get designs compatible with a specific product
     * 
     * @param slug - Product slug identifier
     * @param page - Page number (default: 0)
     * @param size - Items per page (default: 20)
     */
    getCompatibleDesigns: async (
        slug: string,
        page: number = 0,
        size: number = 20
    ): Promise<PagedResponse<Design>> => {
        const { data } = await apiClient.get<PagedResponse<Design>>(
            `/api/v1/products/${slug}/designs`,
            { params: { page, size } }
        );
        return data;
    },


}