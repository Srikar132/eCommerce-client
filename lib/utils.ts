import { ProductListRequestParams } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const buildQueryFromURL = (searchParams: Record<string , string | string[] | undefined>): Record<string, string | string[]> => {
  const out: Record<string, string | string[]> = {};
  Object.entries(searchParams).forEach(([key, value]  ) => {
    // accumulate repeated keys as array (e.g., color=Red&color=Blue)
    if (value !== undefined) {
      if (out[key]) {
        const prev = out[key];
        out[key] = Array.isArray(prev) 
          ? [...prev, ...(Array.isArray(value) ? value : [value])] 
          : [prev as string, ...(Array.isArray(value) ? value : [value])];
      } else {
        out[key] = value;
      }
    }
  });
  return out;
};

// utils/format.ts
export const formatPrice = (price: number): string => {
    return `INR ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const buildParams = (params: ProductListRequestParams) => {
  const searchParams = new URLSearchParams();

  // Helper to append valid values
  const append = (key: string, value: any) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.append(key, String(value));
  };

  // 1. Handle Lists (category, brand, size, color)
  // Backend expects: ?category=slug1&category=slug2
  params.category?.forEach(v => append("category", v));
  params.brand?.forEach(v => append("brand", v));
  params.size?.forEach(v => append("size", v));
  params.color?.forEach(v => append("color", v));

  // 2. Handle Singles
  append("minPrice", params.minPrice);
  append("maxPrice", params.maxPrice);
  append("customizable", params.customizable);
  append("sort", params.sort);
  append("page", params.page);
  append("limit", params.limit);

  return searchParams.toString();
};


// Normalize a string or array of strings into an array of strings
export function normalizeArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}