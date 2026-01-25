// lib/api/category.ts
import { apiClient } from "./client";
import { AxiosResponse } from "axios";
import { CategoryResponse as Category } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface CategoryFilters {
    slug?: string;
    includeChildren?: boolean;
    recursive?: boolean;
    minimal?: boolean;
    includeInactive?: boolean;
    includeProductCount?: boolean;
}

export interface FetchCategoryList {
    filters?: CategoryFilters;
}

export interface CategoryTree {
    id: string;
    name: string;
    slug: string;
    children: CategoryWithChildren[];
}

export interface CategoryWithChildren {
    id: string;
    name: string;
    slug: string;
    subCategories?: CategoryWithChildren[];
    productCount?: number;
}

// ============================================================================
// SERVER-SIDE FUNCTIONS (Next.js 15+ with native caching)
// ============================================================================

/**
 * Server-only function to fetch complete category tree
 * Uses Next.js native caching for optimal performance
 * This should be called from Server Components only
 */
export async function getCategoryTreeServer(): Promise<CategoryTree[]> {
    try {
        // Fetch root categories
        const rootResponse = await fetch(
            `${API_URL}/api/v1/categories?minimal=true`,
            {
                next: { 
                    revalidate: 3600, // Cache for 1 hour
                    tags: ['categories'] 
                },
                cache: 'force-cache'
            }
        );
        
        if (!rootResponse.ok) {
            console.error('Failed to fetch root categories:', rootResponse.statusText);
            throw new Error('Failed to fetch root categories');
        }
        
        const rootCategories = await rootResponse.json();

        // Fetch ALL children in parallel for each root category
        const categoryTreePromises = rootCategories.map(async (root: any) => {
            try {
                const childrenResponse = await fetch(
                    `${API_URL}/api/v1/categories?slug=${root.slug}&recursive=true&minimal=true&includeProductCount=true`,
                    {
                        next: { 
                            revalidate: 3600,
                            tags: [`category-${root.slug}`] 
                        },
                        cache: 'force-cache'
                    }
                );
                
                if (!childrenResponse.ok) {
                    console.warn(`Failed to fetch children for ${root.slug}`);
                    return {
                        id: root.id,
                        name: root.name,
                        slug: root.slug,
                        children: []
                    };
                }
                
                const children = await childrenResponse.json();
                
                return {
                    id: root.id,
                    name: root.name,
                    slug: root.slug,
                    children: children
                };
            } catch (error) {
                console.error(`Error fetching children for ${root.slug}:`, error);
                return {
                    id: root.id,
                    name: root.name,
                    slug: root.slug,
                    children: []
                };
            }
        });

        const categoryTree = await Promise.all(categoryTreePromises);
        return categoryTree;
        
    } catch (error) {
        console.error('Error fetching category tree:', error);
        throw error;
    }
}

// ============================================================================
// CLIENT-SIDE API (for TanStack Query and client components)
// ============================================================================

export const categoryApi = {
    /**
     * GET /api/v1/categories?
        slug=men&
        includeChildren=true&
        recursive=true&
        minimal=true&
        includeInactive=false&
        includeProductCount=true
     */
    getCategories: async ({ filters }: FetchCategoryList = {}) => {
        // Let axios handle query parameters using the params option
        const res: AxiosResponse<Category[]> = await apiClient.get(
            `/api/v1/categories`,
            {
                params: filters || {} // axios will automatically convert this to query string
            }
        );

        return res.data;
    },
};