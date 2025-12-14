import { FetchProductList, ProductListResponse } from "@/types";
import { buildParams, normalizeArray } from "../utils";
import { apiClient } from "./client";
import { Axios, AxiosResponse } from "axios";


export const productApi = {
    /**
     * GET /api/v1/products?
        category=t-shirts,jeans&
        brand=nike,adidas&
        minPrice=0&
        maxPrice=200&
        size=M,L&
        color=black,blue&
        customizable=true&
        sort=price:asc&
        page=1&
        limit=24
     */
    getProducts: async ({
        filters,
        page = 1,
        limit,
        sort = 'createdAt:desc'
    }: FetchProductList) => {



        const params = {
            page,
            limit,
            sort,

            // Extract filters
            category: normalizeArray(filters.category),
            brand: normalizeArray(filters.brand),
            size: normalizeArray(filters.size), // Product sizes
            color: normalizeArray(filters.color),
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
            customizable: filters.customizable === 'true',
        };

        const queryString = buildParams(params);

        const res: AxiosResponse<ProductListResponse> = await apiClient.get(`/api/v1/products?${queryString}`);

        return res.data;
    },



}