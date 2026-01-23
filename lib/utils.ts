import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// convertSearchParamsToObject.ts
export function convertSearchParamsToObject(searchParams: URLSearchParams): Record<string, string | string[]> {
  const paramsObj: Record<string, string | string[]> = {};
  const sizeValues: string[] = [];
  
  searchParams.forEach((value, key) => {
    if (key === 'size') {
      sizeValues.push(value);
      return;
    }
    
    const existing = paramsObj[key];
    if (existing) {
      paramsObj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      paramsObj[key] = value;
    }
  });
  
  // Process size values: separate pagination size from product sizes
  if (sizeValues.length > 0) {
    const paginationSizes = sizeValues.filter(v => /^\d+$/.test(v) && parseInt(v) > 10);
    const productSizes = sizeValues.filter(v => !/^\d+$/.test(v) || parseInt(v) <= 10);
    
    if (paginationSizes.length > 0) {
      paramsObj.paginationSize = paginationSizes[0]; // Take the first pagination size
    }
    
    if (productSizes.length > 0) {
      paramsObj.productSize = productSizes.length === 1 ? productSizes[0] : productSizes;
    }
  }
  
  return paramsObj;
}

// utils/format.ts
export const formatPrice = (price: number): string => {
    return `INR ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format currency using the Indian Rupee format
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Format date to a readable string
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  return new Date(dateString).toLocaleDateString('en-IN', defaultOptions);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildParams = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const append = (key: string, value: any) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === 'boolean' && value === false) return;
    searchParams.append(key, String(value));
  };

  // Handle arrays (category, brand, productSize, color)
  if (params.category) {
    (Array.isArray(params.category) ? params.category : [params.category])
      .forEach(v => append("category", v));
  }
  
  if (params.brand) {
    (Array.isArray(params.brand) ? params.brand : [params.brand])
      .forEach(v => append("brand", v));
  }
  
  if (params.productSize) {
    (Array.isArray(params.productSize) ? params.productSize : [params.productSize])
      .forEach(v => append("productSize", v));  // Changed back to "productSize"
  }
  
  if (params.color) {
    (Array.isArray(params.color) ? params.color : [params.color])
      .forEach(v => append("color", v));
  }

  // Handle single values
  append("minPrice", params.minPrice);
  append("maxPrice", params.maxPrice);
  append("customizable", params.customizable);
  append("sort", params.sort);
  append("page", params.page);
  append("size", params.size);
  append("searchQuery", params.searchQuery);
  append("categorySlug" , params.categorySlug);
  append("q" , params.q);
  append("isPremium" , params.isPremium);

  return searchParams.toString();
};

// Normalize a string or array of strings into an array of strings
export function normalizeArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}


 export const parseCustomizationSnapshot = (snapshot: string | null | undefined) => {
    if (!snapshot) return null;
    try {
      return JSON.parse(snapshot) as {
        designId?: string;
        previewUrl?: string;
        threadColor?: string;
        additionalNotes?: string;
      };
    } catch (error) {
      console.error('Failed to parse customization snapshot:', error);
      return null;
    }
  };