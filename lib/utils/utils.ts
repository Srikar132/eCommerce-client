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

export const buildParams = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();

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
      .forEach(v => append("productSize", v));
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

  return searchParams.toString();
};

// Normalize a string or array of strings into an array of strings
export function normalizeArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}