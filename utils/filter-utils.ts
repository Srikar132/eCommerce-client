/**
 * Filter Utilities
 * 
 * Clean utilities for parsing and managing filters from URL search params
 */

import { ReadonlyURLSearchParams } from "next/navigation";

// Base filters type (no undefined values)
export type ProductFiltersRecord = Record<string, string | string[] | boolean | number>;

export interface ProductFilters {
  category?: string | string[];
  brand?: string | string[];
  productSize?: string | string[];
  color?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  customizable?: boolean;
  searchQuery?: string;
}

export interface QueryParams {
  filters: ProductFiltersRecord;
  page: number;
  size: number;
  sort: string;
}

/**
 * Parse server component search params into structured query parameters
 * Use this in Server Components (app router pages)
 */
export function parseSearchParams(params: Record<string, string | string[] | undefined>): QueryParams {
  const filters: ProductFiltersRecord = {};

  // Parse array/string filters
  if (params.category) {
    filters.category = Array.isArray(params.category)
      ? params.category
      : [params.category];
  }

  if (params.brand) {
    filters.brand = Array.isArray(params.brand)
      ? params.brand
      : [params.brand];
  }

  if (params.productSize) {
    filters.productSize = Array.isArray(params.productSize)
      ? params.productSize
      : [params.productSize];
  }

  if (params.color) {
    filters.color = Array.isArray(params.color)
      ? params.color
      : [params.color];
  }

  // Parse number filters
  if (params.minPrice) {
    filters.minPrice = Number(params.minPrice);
  }

  if (params.maxPrice) {
    filters.maxPrice = Number(params.maxPrice);
  }

  // Parse boolean filters
  if (params.customizable === 'true') {
    filters.customizable = true;
  }

  // Parse search query
  if (params.searchQuery) {
    filters.searchQuery = params.searchQuery;
  }

  // Parse pagination - page (0-based)
  const page = typeof params.page === 'string'
    ? Math.max(0, parseInt(params.page) - 1)  // Convert 1-based URL to 0-based
    : 0;

  // Parse size
  const size = typeof params.size === 'string'
    ? parseInt(params.size)
    : 24;

  // Parse sort
  const sort = typeof params.sort === 'string'
    ? params.sort
    : 'createdAt,desc';

  return { filters, page, size, sort };
}

/**
 * Parse client-side URLSearchParams into structured query parameters
 * Use this in Client Components with useSearchParams()
 */
export function parseURLSearchParams(searchParams: ReadonlyURLSearchParams): QueryParams {
  const filters: ProductFiltersRecord = {};

  // Helper to get param (handles single and multiple values)
  const getParam = (key: string): string | string[] | undefined => {
    const values = searchParams.getAll(key);
    if (values.length === 0) return undefined;
    return values.length > 1 ? values : values[0];
  };

  // Parse array/string filters
  const category = getParam('category');
  if (category) filters.category = category;

  const brand = getParam('brand');
  if (brand) filters.brand = brand;

  const productSize = getParam('productSize');
  if (productSize) filters.productSize = productSize;

  const color = getParam('color');
  if (color) filters.color = color;

  // Parse number filters
  const minPrice = searchParams.get('minPrice');
  if (minPrice) filters.minPrice = Number(minPrice);

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) filters.maxPrice = Number(maxPrice);

  // Parse boolean filters
  const customizable = searchParams.get('customizable');
  if (customizable === 'true') filters.customizable = true;

  // Parse search query
  const searchQuery = searchParams.get('searchQuery');
  if (searchQuery) filters.searchQuery = searchQuery;

  // Parse pagination
  const page = searchParams.get('page');
  const pageNum = page ? Math.max(0, parseInt(page) - 1) : 0;

  const size = searchParams.get('size');
  const sizeNum = size ? parseInt(size) : 24;

  // Parse sort
  const sort = searchParams.get('sort') || 'createdAt,desc';

  return { filters, page: pageNum, size: sizeNum, sort };
}

/**
 * Convert filters to the format expected by FilterSidebar
 */
export function formatFiltersForSidebar(filters: ProductFiltersRecord): Record<string, string | string[]> {
  const formatted: Record<string, string | string[]> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formatted[key] = value;
    } else if (typeof value === 'string') {
      formatted[key] = value;
    } else if (typeof value === 'boolean' && value) {
      formatted[key] = 'true';
    } else if (typeof value === 'number') {
      formatted[key] = value.toString();
    }
  });

  return formatted;
}

/**
 * Count active filters (for badge display)
 */
export function countActiveFilters(filters: ProductFiltersRecord): number {
  return Object.values(filters).reduce((count: number, value) => {
    if (Array.isArray(value)) return count + value.length;
    if (typeof value === 'string') return count + 1;
    if (typeof value === 'boolean' && value) return count + 1;
    if (typeof value === 'number') return count + 1;
    return count;
  }, 0);
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: ProductFiltersRecord): boolean {
  return Object.keys(filters).length > 0;
}

/**
 * Get filter display label
 */
export function getFilterLabel(key: string, value: string | string[] | number | boolean): string {
  if (Array.isArray(value)) {
    return `${key}: ${value.join(', ')}`;
  }
  return `${key}: ${value}`;
}

/**
 * Remove a specific filter value
 */
export function removeFilterValue(
  filters: ProductFiltersRecord,
  key: string,
  value?: string
): ProductFiltersRecord {
  const newFilters = { ...filters };
  
  if (!value) {
    // Remove entire filter
    delete newFilters[key];
  } else {
    // Remove specific value from array
    const currentValue = newFilters[key];
    if (Array.isArray(currentValue)) {
      const newArray = currentValue.filter(v => v !== value);
      if (newArray.length === 0) {
        delete newFilters[key];
      } else {
        newFilters[key] = newArray;
      }
    } else {
      delete newFilters[key];
    }
  }
  
  return newFilters;
}

/**
 * Clear all filters
 */
export function clearAllFilters(): ProductFiltersRecord {
  return {};
}
