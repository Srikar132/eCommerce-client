// lib/utils/category-utils.ts
import { CategoryResponse as Category, CategoryNavItem, MegaMenuSection } from '@/types';

/**
 * Transform Category to CategoryNavItem for navigation rendering
 * Converts API response to a more navigation-friendly structure
 */
export const transformToNavItem = (category: Category): CategoryNavItem => {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    href: `/categories/${category.slug}`,
    productCount: category.productCount,
    subItems: category.subCategories?.map(transformToNavItem),
  };
};

/**
 * Transform Category to MegaMenuSection for mega menu rendering
 * Groups subcategories into columns for better visual organization
 */
export const transformToMegaMenuSections = (
  category: Category
): MegaMenuSection[] => {
  if (!category.subCategories || category.subCategories.length === 0) {
    return [];
  }

  return category.subCategories.map((subCat) => ({
    title: subCat.name,
    slug: subCat.slug,
    items: (subCat.subCategories || []).map((subSubCat) => ({
      name: subSubCat.name,
      slug: subSubCat.slug,
      href: `/categories/${subSubCat.slug}`,
      productCount: subSubCat.productCount,
    })),
  }));
};

/**
 * Find a category by slug in a nested category tree
 * Recursively searches through the category hierarchy
 */
export const findCategoryBySlug = (
  categories: Category[],
  slug: string
): Category | null => {
  for (const category of categories) {
    // Check current category
    if (category.slug === slug) {
      return category;
    }

    // Search in subcategories recursively
    if (category.subCategories && category.subCategories.length > 0) {
      const found = findCategoryBySlug(category.subCategories, slug);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Build breadcrumb path for a category
 * Traverses up the category tree to build the full path
 */
export const buildCategoryBreadcrumb = (
  categories: Category[],
  targetSlug: string
): { name: string; slug: string; href: string }[] => {
  const breadcrumb: { name: string; slug: string; href: string }[] = [];

  const findPath = (
    cats: Category[],
    target: string,
    path: Category[] = []
  ): boolean => {
    for (const cat of cats) {
      const currentPath = [...path, cat];

      if (cat.slug === target) {
        // Found target, build breadcrumb from path
        breadcrumb.push(
          ...currentPath.map((c) => ({
            name: c.name,
            slug: c.slug,
            href: `/categories/${c.slug}`,
          }))
        );
        return true;
      }

      if (cat.subCategories && cat.subCategories.length > 0) {
        if (findPath(cat.subCategories, target, currentPath)) {
          return true;
        }
      }
    }
    return false;
  };

  findPath(categories, targetSlug);
  return breadcrumb;
};

/**
 * Get all leaf categories (categories without subcategories)
 * Useful for filtering or displaying only end-level categories
 */
export const getLeafCategories = (categories: Category[]): Category[] => {
  const leaves: Category[] = [];

  const traverse = (cats: Category[]) => {
    for (const cat of cats) {
      if (!cat.subCategories || cat.subCategories.length === 0) {
        leaves.push(cat);
      } else {
        traverse(cat.subCategories);
      }
    }
  };

  traverse(categories);
  return leaves;
};

/**
 * Get category depth/level in the hierarchy
 */
export const getCategoryDepth = (
  categories: Category[],
  targetSlug: string,
  currentDepth: number = 0
): number => {
  for (const cat of categories) {
    if (cat.slug === targetSlug) {
      return currentDepth;
    }

    if (cat.subCategories && cat.subCategories.length > 0) {
      const depth = getCategoryDepth(cat.subCategories, targetSlug, currentDepth + 1);
      if (depth !== -1) return depth;
    }
  }

  return -1; // Not found
};

/**
 * Flatten category tree to a single array
 * Useful for search or listing all categories
 */
export const flattenCategories = (categories: Category[]): Category[] => {
  const flattened: Category[] = [];

  const traverse = (cats: Category[]) => {
    for (const cat of cats) {
      flattened.push(cat);
      if (cat.subCategories && cat.subCategories.length > 0) {
        traverse(cat.subCategories);
      }
    }
  };

  traverse(categories);
  return flattened;
};