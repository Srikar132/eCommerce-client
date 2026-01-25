import { 
    Design,
    DesignCategory,
    PagedResponse
} from "@/types";
import { apiClient } from "./client";

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

/**
 * Design API - Uses apiClient (axios) for all requests
 * Works seamlessly with TanStack Query
 */
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
        const params: Record<string, string> = {
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir,
        };

        if (filters?.categorySlug) params.categorySlug = filters.categorySlug;
        if (filters?.q) params.q = filters.q;
        if (filters?.isPremium !== undefined) params.isPremium = filters.isPremium.toString();

        const { data } = await apiClient.get<PagedResponse<Design>>('/api/v1/designs', { params });
        return data;
    },

    /**
     * GET /api/v1/designs/{id}
     * Get single design by ID with full details
     * 
     * @param id - Design UUID
     * 
     * Example:
     * - getDesignById('123e4567-e89b-12d3-a456-426614174000')
     */
    getDesignById: async (id: string): Promise<Design> => {
        const { data } = await apiClient.get<Design>(`/api/v1/designs/${id}`);
        return data;
    },

    /**
     * GET /api/v1/designs/categories
     * Get all design categories
     */
    getAllDesignCategories: async (): Promise<DesignCategory[]> => {
        const { data } = await apiClient.get<DesignCategory[]>('/api/v1/designs/categories');
        return data;
    }
};