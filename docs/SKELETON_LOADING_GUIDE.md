# Skeleton Loading System

## Overview
This document describes the skeleton loading system implemented throughout the application to provide better user experience during data fetching and page transitions.

## Available Skeleton Components

### 1. Product Skeletons
Located in: `components/ui/skeletons/product-card-skeleton.tsx`

#### ProductCardSkeleton
Displays a placeholder for a single product card with image, title, price, and rating.

```tsx
import { ProductCardSkeleton } from '@/components/ui/skeletons';

<ProductCardSkeleton />
```

#### ProductGridSkeleton
Displays a grid of product card skeletons. Accepts a `count` prop to specify the number of cards.

```tsx
import { ProductGridSkeleton } from '@/components/ui/skeletons';

<ProductGridSkeleton count={8} /> // Default: 8
```

**Used in:**
- `components/product-grid.tsx` - During initial product loading

---

### 2. Cart Skeletons
Located in: `components/ui/skeletons/cart-skeleton.tsx`

#### CartItemSkeleton
Displays a placeholder for a single cart item with image, details, quantity controls, and price.

```tsx
import { CartItemSkeleton } from '@/components/ui/skeletons';

<CartItemSkeleton />
```

#### CartPageSkeleton
Complete cart page skeleton including cart items list and order summary sidebar.

```tsx
import { CartPageSkeleton } from '@/components/ui/skeletons';

<CartPageSkeleton />
```

**Used in:**
- `app/(root)/cart/page.tsx` - When cart data is loading

---

### 3. Product Detail Skeleton
Located in: `components/ui/skeletons/product-detail-skeleton.tsx`

#### ProductDetailSkeleton
Full product detail page skeleton with image gallery, product info, variant selectors, and action buttons.

```tsx
import { ProductDetailSkeleton } from '@/components/ui/skeletons';

<ProductDetailSkeleton />
```

**Used in:**
- `components/product/product-detail-client.tsx` - During product detail loading

---

### 4. Search Skeletons
Located in: `components/ui/skeletons/search-skeleton.tsx`

#### SearchResultSkeleton
Single search result item skeleton.

```tsx
import { SearchResultSkeleton } from '@/components/ui/skeletons';

<SearchResultSkeleton />
```

#### SearchDropdownSkeleton
Complete search dropdown skeleton with multiple search result items.

```tsx
import { SearchDropdownSkeleton } from '@/components/ui/skeletons';

<SearchDropdownSkeleton />
```

**Used in:**
- `components/search-input.tsx` - While search suggestions are loading

---

### 5. Checkout Skeleton
Located in: `components/ui/skeletons/checkout-skeleton.tsx`

#### CheckoutPageSkeleton
Full checkout page skeleton with shipping form, payment section, and order summary.

```tsx
import { CheckoutPageSkeleton } from '@/components/ui/skeletons';

<CheckoutPageSkeleton />
```

**Used in:**
- `app/(root)/checkout/page.tsx` - Suspense fallback

---

### 6. Account Skeletons
Located in: `components/ui/skeletons/account-skeleton.tsx`

#### AccountPageSkeleton
Account page skeleton with sidebar navigation and content area.

```tsx
import { AccountPageSkeleton } from '@/components/ui/skeletons';

<AccountPageSkeleton />
```

#### OrderHistorySkeleton
Order history list skeleton with multiple order cards.

```tsx
import { OrderHistorySkeleton } from '@/components/ui/skeletons';

<OrderHistorySkeleton />
```

---

### 7. Home Page Skeletons
Located in: `components/ui/skeletons/home-skeleton.tsx`

#### HeroSkeleton
Hero section skeleton for landing page.

```tsx
import { HeroSkeleton } from '@/components/ui/skeletons';

<HeroSkeleton />
```

#### CategoryCardSkeleton & CategoryGridSkeleton
Category display skeletons.

```tsx
import { CategoryCardSkeleton, CategoryGridSkeleton } from '@/components/ui/skeletons';

<CategoryCardSkeleton />
<CategoryGridSkeleton count={3} /> // Default: 3
```

#### BrandSkeleton
Brand logos section skeleton.

```tsx
import { BrandSkeleton } from '@/components/ui/skeletons';

<BrandSkeleton />
```

---

## Base Skeleton Component
Located in: `components/ui/skeleton.tsx`

The base `Skeleton` component is used to build all skeleton components.

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-full" />
```

**Default styling:**
- Background: `bg-gray-400/70`
- Animation: `animate-pulse`
- Border radius: `rounded-md`

---

## Implementation Guidelines

### When to Use Skeletons
1. **Initial page load** - Show skeleton while fetching data
2. **Navigation transitions** - Display during route changes
3. **Search/Filter operations** - Show while results are loading
4. **Infinite scroll** - Display at the bottom while loading more items

### Best Practices
1. **Match the layout** - Skeleton should closely resemble the actual content
2. **Appropriate timing** - Only show for operations that take >200ms
3. **Consistent styling** - Use the base Skeleton component for consistency
4. **Proper hierarchy** - Maintain proper loading states (don't mix skeletons with real content)

### Example Usage Pattern

```tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import { ProductGridSkeleton } from '@/components/ui/skeletons';
import ProductGrid from '@/components/product-grid';

export default function ProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <ProductGridSkeleton count={12} />;
  }

  return <ProductGrid products={data} />;
}
```

---

## Customization

### Extending Skeletons
You can create custom skeletons by composing the base `Skeleton` component:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function CustomSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
```

### Customizing Animation
Modify the base skeleton component to change animation:

```tsx
// Faster pulse
<Skeleton className="animate-pulse duration-700" />

// Wave effect (requires additional CSS)
<Skeleton className="animate-shimmer" />
```

---

## Performance Considerations

1. **Avoid over-rendering** - Don't create unnecessarily complex skeletons
2. **Use appropriate counts** - Match the expected number of items
3. **Optimize images** - Skeleton images should be lightweight
4. **Consider viewport** - Adjust skeleton counts for mobile vs desktop

---

## Testing

### Visual Testing
1. Artificially delay API calls to view skeletons
2. Test on slow network connections
3. Verify skeleton matches actual content layout
4. Check responsive behavior

### Code Example for Testing
```tsx
// Add artificial delay
await new Promise(resolve => setTimeout(resolve, 2000));
```

---

## Future Enhancements

1. **Shimmer effect** - Add animated gradient overlay
2. **Adaptive skeletons** - Automatically adjust based on screen size
3. **Progressive loading** - Fade in content as it loads
4. **Skeleton templates** - Pre-built templates for common patterns
5. **Analytics** - Track skeleton display time to identify slow operations

---

## Migration Guide

If you have components using old loading states, migrate them to use skeletons:

### Before:
```tsx
if (isLoading) {
  return <div>Loading...</div>;
}
```

### After:
```tsx
if (isLoading) {
  return <ProductGridSkeleton />;
}
```

---

## Support

For questions or issues with skeleton components:
1. Check this documentation
2. Review example implementations in existing components
3. Refer to the base Skeleton component documentation

---

## Changelog

### Version 1.0.0 (Current)
- Initial implementation of skeleton loading system
- 7 skeleton component categories
- 15+ individual skeleton components
- Complete coverage of major pages and components
