// lib/api/category.ts
import { apiClient } from "./client";
import { AxiosResponse } from "axios";
import { CategoryResponse as Category } from "@/types";

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