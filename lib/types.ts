export type UUID = string;
export type ISODate = string;
export type Cents = number;


export interface BestsellerCardProps {
    imageUrl: string;
    brand: string;
    name: string;
    price: number;
    colors?: string[];
}

export interface featuredCards {
    id: number;
    image: string;
    alt: string;
}


export type Category = {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  metadata?: Record<string, any>;
};

export type ProductCard = {
  id: UUID;
  name: string;
  slug: string;
  brand?: string;
  price: number; // cents
  imageUrl: string;
  badge?: string;
};

export type Product = {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  images: { url: string; alt?: string }[];
  variants: { id: UUID; sku: string; price: number; attributes: Record<string, string>; inStock?: boolean }[];
};

export type Facets = {
  colors?: string[];
  sizes?: string[];
  priceRanges?: { min: number; max: number }[];
  brands?: string[];
  [key: string]: any;
};
