import { FetchProductList, ProductSearchResponse } from "@/types";
import { buildParams } from "../utils";
import { apiClient } from "./client";
import {  AxiosResponse } from "axios";



export const productApi = {
    /**
     * GET /api/v1/products?
        category=shirts&
        category=hoodies&
        brand=nike&
        brand=adidas&
        minPrice=1000&
        maxPrice=5000&
        size=M&
        size=L&
        color=black&
        color=white&
        customizable=true&
        page=0&
        size=24&
        sort=createdAt,desc
     */
    getProducts: async ({
        filters,
        page = 0,
        size = 24,
        sort = 'createdAt,desc'
    }: FetchProductList) => {

        console.log('Fetching products with params:', { filters });

        const params = {
            page,
            size,
            sort,
            ...filters, // Spread filters directly
        };

        const queryString = buildParams(params);
        const res: AxiosResponse<ProductSearchResponse> = await apiClient.get(
            `/api/v1/products?${queryString}`
        );

        return res.data;
    },
};