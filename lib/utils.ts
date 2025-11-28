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