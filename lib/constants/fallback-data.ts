// lib/constants/fallback-data.ts

import { CategoryTree } from "@/lib/api/category";

/**
 * Static Fallback Category Data
 * Used when API is unavailable or network fails
 * Ensures the site always renders with categories
 */
export const FALLBACK_CATEGORIES = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Men",
    slug: "men",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Women",
    slug: "women",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Kids",
    slug: "kids",
  },
];

/**
 * Complete Fallback Category Tree for Server-Side Rendering
 * Includes full hierarchy with all subcategories
 */
export const FALLBACK_CATEGORY_TREE: CategoryTree[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "MEN",
    slug: "men",
    children: [
      {
        id: "11111111-1111-2222-2222-222222222221",
        name: "Topwear",
        slug: "men-topwear",
        subCategories: [
          { id: "1001", name: "T-Shirts", slug: "men-tshirts", productCount: 89 },
          { id: "1002", name: "Casual Shirts", slug: "men-casual-shirts", productCount: 45 },
          { id: "1003", name: "Formal Shirts", slug: "men-formal-shirts", productCount: 32 },
          { id: "1004", name: "Polo Shirts", slug: "men-polo-shirts", productCount: 28 },
          { id: "1005", name: "Hoodies & Sweatshirts", slug: "men-hoodies-sweatshirts", productCount: 56 },
          { id: "1006", name: "Jackets", slug: "men-jackets", productCount: 34 },
        ],
      },
      {
        id: "11111111-1111-2222-2222-222222222222",
        name: "Bottomwear",
        slug: "men-bottomwear",
        subCategories: [
          { id: "1007", name: "Jeans", slug: "men-jeans", productCount: 67 },
          { id: "1008", name: "Casual Trousers", slug: "men-casual-trousers", productCount: 43 },
          { id: "1009", name: "Formal Trousers", slug: "men-formal-trousers", productCount: 38 },
          { id: "1010", name: "Shorts", slug: "men-shorts", productCount: 52 },
          { id: "1011", name: "Joggers", slug: "men-joggers", productCount: 41 },
        ],
      },
      {
        id: "11111111-1111-2222-2222-222222222223",
        name: "Footwear",
        slug: "men-footwear",
        subCategories: [
          { id: "1012", name: "Casual Shoes", slug: "men-casual-shoes", productCount: 78 },
          { id: "1013", name: "Sneakers", slug: "men-sneakers", productCount: 92 },
          { id: "1014", name: "Formal Shoes", slug: "men-formal-shoes", productCount: 46 },
          { id: "1015", name: "Sports Shoes", slug: "men-sports-shoes", productCount: 63 },
          { id: "1016", name: "Sandals & Floaters", slug: "men-sandals", productCount: 35 },
        ],
      },
      {
        id: "11111111-1111-2222-2222-222222222224",
        name: "Accessories",
        slug: "men-accessories",
        subCategories: [
          { id: "1017", name: "Watches", slug: "men-watches", productCount: 54 },
          { id: "1018", name: "Belts", slug: "men-belts", productCount: 37 },
          { id: "1019", name: "Wallets", slug: "men-wallets", productCount: 42 },
          { id: "1020", name: "Sunglasses", slug: "men-sunglasses", productCount: 28 },
        ],
      },
    ],
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "WOMEN",
    slug: "women",
    children: [
      {
        id: "22222222-2222-3333-3333-333333333331",
        name: "Western Wear",
        slug: "women-western-wear",
        subCategories: [
          { id: "2001", name: "Dresses", slug: "women-dresses", productCount: 87 },
          { id: "2002", name: "Tops", slug: "women-tops", productCount: 94 },
          { id: "2003", name: "T-Shirts", slug: "women-tshirts", productCount: 76 },
          { id: "2004", name: "Jeans", slug: "women-jeans", productCount: 68 },
          { id: "2005", name: "Skirts", slug: "women-skirts", productCount: 45 },
          { id: "2006", name: "Jackets", slug: "women-jackets", productCount: 39 },
        ],
      },
      {
        id: "22222222-2222-3333-3333-333333333332",
        name: "Ethnic Wear",
        slug: "women-ethnic-wear",
        subCategories: [
          { id: "2007", name: "Kurtas & Kurtis", slug: "women-kurtas-kurtis", productCount: 103 },
          { id: "2008", name: "Sarees", slug: "women-sarees", productCount: 89 },
          { id: "2009", name: "Lehengas", slug: "women-lehengas", productCount: 56 },
          { id: "2010", name: "Salwar Suits", slug: "women-salwar-suits", productCount: 72 },
        ],
      },
      {
        id: "22222222-2222-3333-3333-333333333333",
        name: "Footwear",
        slug: "women-footwear",
        subCategories: [
          { id: "2011", name: "Flats", slug: "women-flats", productCount: 84 },
          { id: "2012", name: "Heels", slug: "women-heels", productCount: 67 },
          { id: "2013", name: "Sneakers", slug: "women-sneakers", productCount: 59 },
          { id: "2014", name: "Sandals", slug: "women-sandals", productCount: 71 },
        ],
      },
      {
        id: "22222222-2222-3333-3333-333333333334",
        name: "Accessories",
        slug: "women-accessories",
        subCategories: [
          { id: "2015", name: "Handbags", slug: "women-handbags", productCount: 92 },
          { id: "2016", name: "Jewelry", slug: "women-jewelry", productCount: 105 },
          { id: "2017", name: "Sunglasses", slug: "women-sunglasses", productCount: 43 },
          { id: "2018", name: "Watches", slug: "women-watches", productCount: 58 },
        ],
      },
    ],
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "KIDS",
    slug: "kids",
    children: [
      {
        id: "33333333-3333-4444-4444-444444444441",
        name: "Boys",
        slug: "boys",
        subCategories: [
          { id: "3001", name: "T-Shirts", slug: "boys-tshirts", productCount: 64 },
          { id: "3002", name: "Shirts", slug: "boys-shirts", productCount: 48 },
          { id: "3003", name: "Shorts", slug: "boys-shorts", productCount: 52 },
          { id: "3004", name: "Jeans", slug: "boys-jeans", productCount: 43 },
          { id: "3005", name: "Ethnic Wear", slug: "boys-ethnic-wear", productCount: 28 },
        ],
      },
      {
        id: "33333333-3333-4444-4444-444444444442",
        name: "Girls",
        slug: "girls",
        subCategories: [
          { id: "3006", name: "Dresses", slug: "girls-dresses", productCount: 78 },
          { id: "3007", name: "Tops", slug: "girls-tops", productCount: 69 },
          { id: "3008", name: "T-Shirts", slug: "girls-tshirts", productCount: 57 },
          { id: "3009", name: "Jeans", slug: "girls-jeans", productCount: 45 },
          { id: "3010", name: "Ethnic Wear", slug: "girls-ethnic-wear", productCount: 52 },
        ],
      },
      {
        id: "33333333-3333-4444-4444-444444444443",
        name: "Footwear",
        slug: "kids-footwear",
        subCategories: [
          { id: "3011", name: "Sneakers", slug: "kids-sneakers", productCount: 67 },
          { id: "3012", name: "Sandals", slug: "kids-sandals", productCount: 54 },
          { id: "3013", name: "School Shoes", slug: "kids-school-shoes", productCount: 48 },
          { id: "3014", name: "Sports Shoes", slug: "kids-sports-shoes", productCount: 39 },
        ],
      },
    ],
  },
];

/**
 * Legacy fallback - keeping for backward compatibility
 */
export const FALLBACK_MEN_SUBCATEGORIES = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Men",
  slug: "men",
  subCategories: FALLBACK_CATEGORY_TREE[0].children,
};