// lib/constants/fallback-data.ts

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
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Home",
    slug: "home",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Beauty",
    slug: "beauty",
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: "Studio",
    slug: "studio",
  },
];

/**
 * Fallback subcategories for Men category
 */
export const FALLBACK_MEN_SUBCATEGORIES = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Men",
  slug: "men",
  subCategories: [
    {
      id: "11111111-1111-2222-2222-222222222221",
      name: "Topwear",
      slug: "men-topwear",
      subCategories: [
        { id: "1", name: "T-Shirts", slug: "men-tshirts" },
        { id: "2", name: "Casual Shirts", slug: "men-casual-shirts" },
        { id: "3", name: "Formal Shirts", slug: "men-formal-shirts" },
        { id: "4", name: "Polo Shirts", slug: "men-polo-shirts" },
        { id: "5", name: "Hoodies & Sweatshirts", slug: "men-hoodies-sweatshirts" },
        { id: "6", name: "Jackets", slug: "men-jackets" },
      ],
    },
    {
      id: "11111111-1111-2222-2222-222222222222",
      name: "Bottomwear",
      slug: "men-bottomwear",
      subCategories: [
        { id: "7", name: "Jeans", slug: "men-jeans" },
        { id: "8", name: "Casual Trousers", slug: "men-casual-trousers" },
        { id: "9", name: "Formal Trousers", slug: "men-formal-trousers" },
        { id: "10", name: "Shorts", slug: "men-shorts" },
        { id: "11", name: "Joggers", slug: "men-joggers" },
      ],
    },
    {
      id: "11111111-1111-2222-2222-222222222223",
      name: "Footwear",
      slug: "men-footwear",
      subCategories: [
        { id: "12", name: "Casual Shoes", slug: "men-casual-shoes" },
        { id: "13", name: "Sneakers", slug: "men-sneakers" },
        { id: "14", name: "Formal Shoes", slug: "men-formal-shoes" },
        { id: "15", name: "Sports Shoes", slug: "men-sports-shoes" },
        { id: "16", name: "Sandals & Floaters", slug: "men-sandals" },
      ],
    },
  ],
};