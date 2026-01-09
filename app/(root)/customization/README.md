# Customization Page

This directory contains the customization flow where users can select designs for their customizable products.

## File Structure

```
customization/
  [slug]/
    page.tsx                 # Server component wrapper
    customization-client.tsx # Client component with UI logic
```

## Features

### Product Display (Left Side)
- Shows the product image from the first variant
- Displays product name, description, and base price
- Sticky positioning for better UX during scrolling

### Design Selection (Right Side)
- Two-column grid layout of compatible designs
- Visual feedback for selected design (primary border + checkmark overlay)
- Displays design name and additional price
- Infinite scrollable list with 20 designs loaded initially

### Bottom Action Bar
- Fixed position at the bottom of the viewport
- Shows selection status
- Continue button (disabled until design selected)
- Navigates to next step: `/customization/{productSlug}/{designId}`

## Data Fetching

Uses TanStack Query (React Query) hooks from `product.queries.ts`:

```typescript
// Fetch product details
const { data: product, isLoading } = useProduct(slug);

// Fetch compatible designs
const { data: designsData, isLoading } = useCompatibleDesigns(slug, page, size);
```

## Component Hierarchy

```
CustomizationPage (Server Component)
  └── CustomizationClient (Client Component)
        ├── Header with Back Button
        ├── Product Display Section
        │     ├── Product Image
        │     └── Product Info Card
        ├── Design Grid Section
        │     └── DesignCard[] (clickable cards)
        └── Fixed Bottom Bar
              └── Continue Button
```

## State Management

```typescript
const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
```

- Single design selection (radio button behavior)
- Visual feedback on selection
- Continue button enabled only when design selected

## Styling

- **Layout**: Grid layout (2 columns on desktop, 1 on mobile)
- **Sticky Sidebar**: Product info stays visible while scrolling designs
- **Fixed Bottom Bar**: Always visible continue button
- **Design Cards**: Hover effects, border on selection, checkmark overlay
- **Responsive**: Mobile-first approach with Tailwind CSS

## Loading States

- Skeleton loaders for product and designs
- Graceful handling of missing images
- Empty state when no designs available

## Error Handling

- Product not found: Shows error message with "Browse Products" button
- No designs available: Shows empty state with navigation option
- Loading states for both product and designs

## Next Steps

When user clicks "Continue", they navigate to:
```
/customization/{productSlug}/{designId}
```

This is where they'll:
1. Choose variant (size/color)
2. Customize design placement
3. Add personalization (text, etc.)
4. Add to cart

## Type Safety

All components use proper TypeScript types:
- `ProductResponse` - Product details
- `DesignCompatibilityResponse` - Design list with pagination
- `Design` - Individual design object
- `ProductVariant` - Product variant with images

## UI Components Used

From `@/components/ui`:
- `Button` - CTA buttons
- `ScrollArea` - Scrollable design grid
- `Skeleton` - Loading placeholders

From `lucide-react`:
- `ArrowLeft` - Back button icon
- `Check` - Selection checkmark

## Accessibility

- Semantic HTML structure
- Keyboard navigation support (buttons)
- Alt text for all images
- Clear visual feedback for interactions
- Disabled state for continue button

## Future Enhancements

1. **Infinite Scroll**: Load more designs as user scrolls
2. **Design Filters**: Filter by category, tags, colors
3. **Design Preview**: Larger preview on hover/click
4. **Favorites**: Allow users to favorite designs
5. **Search**: Search through available designs
6. **Price Update**: Show live price with selected design
