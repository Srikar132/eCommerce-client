# URL-Based Filtering for Customization Page

## Overview
Converted the customization page to use URL query parameters for search and category filtering, making the page shareable and supporting browser back/forward navigation.

## Changes Made

### 1. Search Functionality

**Before:**
- Used local state `searchQuery` that updated immediately on input change
- Not shareable via URL
- No browser history support

**After:**
- Uses URL query parameter `?search=keyword`
- Form-based submission with a "Search" button
- Default value from URL on page load
- Full browser history support

**Implementation:**
```tsx
// Search Form with submit button
<form onSubmit={handleSearchSubmit} className="relative group">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
  <Input
    type="text"
    name="search"
    placeholder="Search for designs..."
    defaultValue={searchQuery}
    className="pl-11 pr-24 h-12 rounded-2xl"
  />
  <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
    Search
  </Button>
</form>

// Handler extracts form data and updates URL
const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const searchValue = formData.get('search') as string;
  router.push(buildURL({ search: searchValue }));
};
```

### 2. Category Tab Filtering

**Before:**
- Used local state `selectedCategory`
- Changed immediately on click
- Not reflected in URL

**After:**
- Uses URL query parameter `?tab=category-slug`
- Updates URL on tab change
- Preserves state across page reloads

**Implementation:**
```tsx
// Get category from URL
const selectedCategory = searchParams.get('tab') || 'all';

// Handler updates URL when tab changes
const handleCategoryChange = (value: string) => {
  router.push(buildURL({ tab: value }));
};

// Tabs component uses the handler
<Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
  <TabsTrigger value="all">All Designs</TabsTrigger>
  <TabsTrigger value="animals">Animals</TabsTrigger>
  {/* ... */}
</Tabs>
```

### 3. URL Builder Helper Function

Created a centralized function to build URLs with query parameters:

```tsx
const buildURL = (params: { search?: string; tab?: string }) => {
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  
  // Update search param
  if (params.search !== undefined) {
    if (params.search) {
      current.set('search', params.search);
    } else {
      current.delete('search');
    }
  }
  
  // Update tab param
  if (params.tab !== undefined) {
    if (params.tab && params.tab !== 'all') {
      current.set('tab', params.tab);
    } else {
      current.delete('tab');
    }
  }
  
  // Keep variantId in URL
  if (variantId) {
    current.set('variantId', variantId);
  }
  
  // Build the new URL
  const search = current.toString();
  const query = search ? `?${search}` : '';
  
  return `/customization/${slug}${query}`;
};
```

### 4. Clear Filters Handler

```tsx
const handleClearFilters = () => {
  router.push(buildURL({ search: '', tab: 'all' }));
};
```

### 5. ImageRole Integration

Added filtering for `PREVIEW_BASE` images only:

```tsx
// Get the variant image - ONLY show PREVIEW_BASE images for customization
const previewBaseImages = selectedVariant?.images?.filter(img => 
  img.imageRole === 'PREVIEW_BASE' || !img.imageRole // Fallback for images without role
);
const variantImage = previewBaseImages?.[0]; // Use the first PREVIEW_BASE image
```

## URL Structure Examples

### Base customization page
```
/customization/nike-sportswear-essential-tshirt?variantId=123
```

### With search query
```
/customization/nike-sportswear-essential-tshirt?variantId=123&search=floral
```

### With category filter
```
/customization/nike-sportswear-essential-tshirt?variantId=123&tab=animals
```

### With both filters
```
/customization/nike-sportswear-essential-tshirt?variantId=123&search=lion&tab=animals
```

## Query Parameter Details

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `variantId` | UUID | Selected product variant ID (required) | - |
| `search` | string | Search keyword for designs | `''` |
| `tab` | string | Category slug filter | `'all'` |

## Benefits

### 1. Shareable URLs ✅
Users can copy and share URLs with active filters:
```
/customization/product-slug?variantId=123&search=floral&tab=nature
```

### 2. Browser Navigation ✅
- Back button returns to previous filter state
- Forward button works correctly
- Refresh preserves filters

### 3. Bookmarkable ✅
Users can bookmark specific filtered views

### 4. Deep Linking ✅
Can link directly to filtered results from:
- Email campaigns
- Social media
- Product recommendations

### 5. SEO Friendly ✅
Search engines can index filtered pages

### 6. User Experience ✅
- Clear visual feedback with search button
- No accidental searches while typing
- Intentional search submission

## API Integration

The URL parameters are passed to the design query:

```tsx
const {
  data: designsData,
  isLoading: isDesignsLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteDesigns(
  {
    categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
    q: searchQuery || undefined,
  },
  20
);
```

Backend receives:
- `GET /api/v1/designs?categorySlug=animals&q=lion&page=0&size=20`

## Form-Based Approach Benefits

### Search Form
- **Enter key submission**: Users can press Enter to search
- **Form validation**: Can add HTML5 validation if needed
- **Accessibility**: Screen readers understand form structure
- **Progressive enhancement**: Works without JavaScript (could add server action)

### Tab Navigation
- Still uses click events for instant feedback
- Updates URL programmatically
- Maintains SPA feel while being shareable

## Type Safety

Added `ImageRole` type for image filtering:

```typescript
export type ImageRole = 'PREVIEW_BASE' | 'PREVIEW_CUSTOMIZED' | 'GALLERY';

export interface ProductImage {
    id: UUID;
    imageUrl: string;
    altText?: string;
    displayOrder: number;
    isPrimary: boolean;
    imageRole?: ImageRole;  // ✅ NEW
}
```

## Testing Checklist

### Search Functionality
- [ ] Type search query and click Search button
- [ ] Press Enter key in search input
- [ ] Verify URL updates with `?search=keyword`
- [ ] Reload page - search query persists
- [ ] Clear search - URL removes `search` param
- [ ] Back button returns to previous search

### Category Filtering
- [ ] Click different category tabs
- [ ] Verify URL updates with `?tab=category-slug`
- [ ] Reload page - tab selection persists
- [ ] Click "All Designs" - URL removes `tab` param
- [ ] Back button returns to previous category

### Combined Filtering
- [ ] Apply both search and category filter
- [ ] Verify URL has both params
- [ ] Clear filters button removes both
- [ ] Browser navigation works correctly

### Variant Integration
- [ ] Only PREVIEW_BASE images displayed
- [ ] Fallback to any image if no role set
- [ ] Variant info shows correctly
- [ ] variantId persists across filter changes

### Edge Cases
- [ ] Empty search query
- [ ] Special characters in search
- [ ] Invalid category slug in URL
- [ ] Missing variantId in URL
- [ ] Multiple rapid tab switches

## Future Enhancements

1. **Price Range Filter**
   - Add `?minPrice=100&maxPrice=500`

2. **Sort Options**
   - Add `?sort=popular` or `?sort=newest`

3. **Multiple Category Selection**
   - Add `?tab=animals,nature`

4. **Pagination**
   - Add `?page=2` (if switching from infinite scroll)

5. **Design Style Filter**
   - Add `?style=minimalist,abstract`

6. **Server Actions**
   - Convert to full server actions for no-JS support

## Related Files

- `components/customization/customization-client.tsx` - Main component
- `app/(root)/customization/[slug]/page.tsx` - Page component
- `types/index.ts` - Type definitions
- `lib/tanstack/queries/design.queries.ts` - Design API queries

---

**Implementation Date:** January 12, 2026  
**Status:** ✅ Complete - Form-based search with URL parameters
