


import { 
    Design,
    DesignCategory,
    PagedResponse
} from "@/types";
import { apiClient } from "./client";
import { AxiosResponse } from "axios";
import { buildParams } from "../utils";

/**
 * Design API Interface
 * Matches backend DesignController.java endpoints
 */

export interface DesignFilters {
    categorySlug?: string;
    isPremium?: boolean;
    q?: string; // Search query
}

export interface FetchDesignList {
    filters?: DesignFilters;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
}

export const designsApi = {
    /**
     * GET /api/v1/designs
     * Search and filter designs with multiple criteria 
     * 
     * Query parameters:
     * - categorySlug: Filter by design category slug
     * - q: Full-text search query (searches name, description, tags)
     * - isPremium: Boolean filter for premium designs
     * - page: Page number (0-based, default: 0)
     * - size: Items per page (default: 20)
     * - sortBy: Sort field (name, createdAt, downloadCount, default: createdAt)
     * - sortDir: Sort direction (ASC, DESC, default: DESC)
     * 
     * Examples:
     * - getDesigns({ page: 0, size: 20 })
     * - getDesigns({ filters: { q: 'floral' } })
     * - getDesigns({ filters: { categorySlug: 'vintage-patterns', isPremium: false } })
     * - getDesigns({ filters: { q: 'summer' }, sortBy: 'downloadCount', sortDir: 'DESC' })
     */
    getDesigns: async ({
        filters,
        page = 0,
        size = 20,
        sortBy = 'createdAt',
        sortDir = 'DESC'
    }: FetchDesignList): Promise<PagedResponse<Design>> => {

        console.log('Fetching designs with params:', { filters, page, size, sortBy, sortDir });

        const params = {
            page,
            size,
            sortBy,
            sortDir,
            ...filters, // Spread filters directly (categorySlug, q, isPremium)
        };

        const queryString = buildParams(params);
        console.log('Query string:', queryString);
        console.log('Full URL:', `/api/v1/designs?${queryString}`);
        
        const res: AxiosResponse<PagedResponse<Design>> = await apiClient.get(
            `/api/v1/designs?${queryString}`
        );

        console.log('API Response:', res.data);
        console.log(`Fetched ${res.data.content.length} designs out of ${res.data.totalElements} total`);

        return res.data;
    },

    /**
     * GET /api/v1/designs/{id}
     * Get single design by ID with full details (PostgreSQL)
     * 
     * @param id - Design UUID
     * 
     * Example:
     * - getDesignById('123e4567-e89b-12d3-a456-426614174000')
     */
    getDesignById: async (id: string): Promise<Design> => {
        console.log('Fetching design by ID:', id);
        
        const { data } = await apiClient.get<Design>(
            `/api/v1/designs/${id}`
        );

        console.log('Design fetched:', data);
        return data;
    },

    /**
     * Get all design categories
     */
    getAllDesignCategories: async (): Promise<DesignCategory[]> => {
        console.log('Fetching all design categories');

        const { data } = await apiClient.get<DesignCategory[]>(
            `/api/v1/designs/categories`
        );

        console.log('Design categories fetched:', data);
        return data;
    }
};