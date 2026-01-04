// lib/utils/category-utils.ts
import { CategoryDTO, CategoryNavItem, MegaMenuSection } from '@/types';

/**
 * Transform CategoryDTO to CategoryNavItem for navigation rendering
 * Converts API response to a more navigation-friendly structure
 */
export const transformToNavItem = (category: CategoryDTO): CategoryNavItem => {
  console.log('[CategoryUtils] Transforming category to nav item:', category.slug);

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
 * Transform CategoryDTO to MegaMenuSection for mega menu rendering
 * Groups subcategories into columns for better visual organization
 */
export const transformToMegaMenuSections = (
  category: CategoryDTO
): MegaMenuSection[] => {
  console.log('[CategoryUtils] Transforming to mega menu sections:', category.slug);

  if (!category.subCategories || category.subCategories.length === 0) {
    console.log('[CategoryUtils] No subcategories found');
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
  categories: CategoryDTO[],
  slug: string
): CategoryDTO | null => {
  console.log('[CategoryUtils] Finding category by slug:', slug);

  for (const category of categories) {
    // Check current category
    if (category.slug === slug) {
      console.log('[CategoryUtils] Category found:', category);
      return category;
    }

    // Search in subcategories recursively
    if (category.subCategories && category.subCategories.length > 0) {
      const found = findCategoryBySlug(category.subCategories, slug);
      if (found) return found;
    }
  }

  console.log('[CategoryUtils] Category not found for slug:', slug);
  return null;
};

/**
 * Build breadcrumb path for a category
 * Traverses up the category tree to build the full path
 */
export const buildCategoryBreadcrumb = (
  categories: CategoryDTO[],
  targetSlug: string
): { name: string; slug: string; href: string }[] => {
  console.log('[CategoryUtils] Building breadcrumb for:', targetSlug);

  const breadcrumb: { name: string; slug: string; href: string }[] = [];

  const findPath = (
    cats: CategoryDTO[],
    target: string,
    path: CategoryDTO[] = []
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
  console.log('[CategoryUtils] Breadcrumb built:', breadcrumb);
  return breadcrumb;
};

/**
 * Get all leaf categories (categories without subcategories)
 * Useful for filtering or displaying only end-level categories
 */
export const getLeafCategories = (categories: CategoryDTO[]): CategoryDTO[] => {
  console.log('[CategoryUtils] Getting leaf categories');

  const leaves: CategoryDTO[] = [];

  const traverse = (cats: CategoryDTO[]) => {
    for (const cat of cats) {
      if (!cat.subCategories || cat.subCategories.length === 0) {
        leaves.push(cat);
      } else {
        traverse(cat.subCategories);
      }
    }
  };

  traverse(categories);
  console.log('[CategoryUtils] Found', leaves.length, 'leaf categories');
  return leaves;
};

/**
 * Get category depth/level in the hierarchy
 */
export const getCategoryDepth = (
  categories: CategoryDTO[],
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
export const flattenCategories = (categories: CategoryDTO[]): CategoryDTO[] => {
  console.log('[CategoryUtils] Flattening category tree');

  const flattened: CategoryDTO[] = [];

  const traverse = (cats: CategoryDTO[]) => {
    for (const cat of cats) {
      flattened.push(cat);
      if (cat.subCategories && cat.subCategories.length > 0) {
        traverse(cat.subCategories);
      }
    }
  };

  traverse(categories);
  console.log('[CategoryUtils] Flattened to', flattened.length, 'categories');
  return flattened;
};