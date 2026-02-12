/**
 * Search params utilities for building query parameters from URL search params
 */

import { ProductParams } from "@/types/product";
import { UserParams } from "@/types/auth";
import { OrderParams } from "@/types/orders";

/**
 * Get string parameter from search params
 */
export function getStringParam(
    searchParams: URLSearchParams,
    key: string,
    defaultValue?: string
): string | undefined {
    const value = searchParams.get(key);
    return value || defaultValue;
}

/**
 * Get number parameter from search params
 */
export function getNumberParam(
    searchParams: URLSearchParams,
    key: string,
    defaultValue?: number
): number | undefined {
    const value = searchParams.get(key);
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get boolean parameter from search params
 */
export function getBooleanParam(
    searchParams: URLSearchParams,
    key: string
): boolean | undefined {
    const value = searchParams.get(key);
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
}

/**
 * Build product params from URL search params
 */
export function buildProductParams(searchParams: URLSearchParams): ProductParams {
    const sortByParam = getStringParam(searchParams, "sortBy");
    const sortDirParam = getStringParam(searchParams, "sortDir", "DESC") as "ASC" | "DESC";
    let sortBy: ProductParams["sortBy"] = "CREATED_AT_DESC";

    if (sortByParam) {
        const normalized = sortByParam.toUpperCase();
        if (normalized === "PRICE_ASC" || normalized === "PRICE_DESC" || normalized === "CREATED_AT_ASC" || normalized === "CREATED_AT_DESC" || normalized === "BEST_SELLING" || normalized === "RELEVANCE" || normalized === "NAME_ASC" || normalized === "NAME_DESC") {
            sortBy = normalized as ProductParams["sortBy"];
        } else if (sortByParam === "basePrice") {
            sortBy = sortDirParam === "ASC" ? "PRICE_ASC" : "PRICE_DESC";
        } else if (sortByParam === "createdAt") {
            sortBy = sortDirParam === "ASC" ? "CREATED_AT_ASC" : "CREATED_AT_DESC";
        } else if (sortByParam === "name") {
            sortBy = sortDirParam === "ASC" ? "NAME_ASC" : "NAME_DESC";
        }
    }

    return {
        page: getNumberParam(searchParams, "page", 0),
        limit: getNumberParam(searchParams, "size", 20),
        sortBy,
        searchQuery: getStringParam(searchParams, "search"),
        category: getStringParam(searchParams, "category"),
        size: getStringParam(searchParams, "productSize"), // Use different param name for product size
    };
}

/**
 * Build user params from URL search params
 */
export function buildUserParams(searchParams: URLSearchParams): UserParams {
    return {
        page: getNumberParam(searchParams, "page", 0),
        limit: getNumberParam(searchParams, "size", 20),
        sortBy: (getStringParam(searchParams, "sortBy") as UserParams["sortBy"]) || "CREATED_AT_DESC",
        searchQuery: getStringParam(searchParams, "search"),
        role: (getStringParam(searchParams, "role") as UserParams["role"]),
    };
}

/**
 * Build order params from URL search params
 */
export function buildOrderParams(searchParams: URLSearchParams): OrderParams {
    return {
        page: getNumberParam(searchParams, "page", 0),
        limit: getNumberParam(searchParams, "size", 20),
        sortBy: (getStringParam(searchParams, "sortBy") as OrderParams["sortBy"]) || "CREATED_AT_DESC",
        searchQuery: getStringParam(searchParams, "search"),
        status: (getStringParam(searchParams, "status") as OrderParams["status"]),
        paymentStatus: (getStringParam(searchParams, "paymentStatus") as OrderParams["paymentStatus"]),
    };
}