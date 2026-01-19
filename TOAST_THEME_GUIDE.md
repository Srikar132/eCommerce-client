# 🎨 Custom Sonner Toast Theme

## Overview

Your Sonner toast notifications have been completely redesigned to match your website's soft, feminine aesthetic with cream, rose, and pastel colors.

## 🌸 Visual Design Features

### Color Palette (Matches Your Theme)

#### Success Toasts - **Soft Rose/Pink**
- Background: Gradient from light rose to soft pink
- Border: Delicate rose border with transparency
- Icon: Warm rose color
- Use: Successful operations (Added to cart, Profile updated, etc.)

#### Error Toasts - **Soft Coral**
- Background: Gradient from light coral to peachy coral
- Border: Gentle coral border
- Icon: Muted coral red
- Use: Errors and failures (Login failed, Validation errors, etc.)

#### Warning Toasts - **Soft Peach**
- Background: Gradient from cream peach to soft apricot
- Border: Warm peach border
- Icon: Golden peach color
- Use: Warnings (Session expiring, Stock low, etc.)

#### Info Toasts - **Soft Lavender**
- Background: Gradient from pale lavender to soft purple
- Border: Delicate lavender border
- Icon: Gentle purple color
- Use: Information (Already in cart, Feature updates, etc.)

#### Loading Toasts - **Soft Cream**
- Background: Gradient from cream white to warm ivory
- Border: Subtle beige border
- Icon: Rose-tinted spinner
- Use: Loading states (Processing payment, Uploading image, etc.)

## 🎯 Design Elements

### Typography
- **Title**: Semi-bold, 16px, tight letter spacing
- **Description**: Regular, 14px, optimized line height
- **Font**: Uses your site's Inter font family

### Spacing & Layout
- Generous padding: 1rem × 1.25rem
- Minimum height: 4rem for consistency
- Rounded corners: 1rem (matches your site's soft aesthetic)

### Borders & Shadows
- 2px borders with theme colors and transparency
- Elevated shadow (shadow-xl) for depth
- Backdrop blur for modern glass effect

### Buttons
- **Action buttons**: Primary color with hover effects
- **Cancel buttons**: Muted background
- **Close button**: Subtle with opacity transitions
- All buttons have smooth hover animations

### Animations
- **Entry**: Slide in from right with cubic-bezier easing
- **Exit**: Slide out to right with smooth timing
- **Hover**: Subtle scale up (1.02x) with enhanced shadow
- **Duration**: 4 seconds default (configurable)

## 📦 Configuration

### Current Setup (in layout.tsx)

```tsx
<Toaster 
  position="top-right"      // Positioned in top-right corner
  expand={false}            // Compact mode
  richColors={false}        // Uses custom colors
  closeButton               // Shows close button
  duration={4000}           // 4 seconds display time
/>
```

### Available Positions
- `top-left`
- `top-center`
- `top-right` ✅ (current)
- `bottom-left`
- `bottom-center`
- `bottom-right`

## 🚀 Usage Examples

### Success Toast
```typescript
import { toast } from "sonner";

toast.success("Added to cart!", {
  description: "Item added successfully",
  action: {
    label: "View Cart",
    onClick: () => router.push("/cart"),
  },
});
```

**Result:**
- 🌸 Soft rose gradient background
- ✓ Check icon in rose color
- Action button styled in primary color

---

### Error Toast
```typescript
toast.error("Login Required", {
  description: "Please log in to continue",
  action: {
    label: "Log In",
    onClick: () => router.push("/login"),
  },
});
```

**Result:**
- 🧡 Soft coral gradient background
- ✗ Error icon in coral color
- Clear error messaging

---

### Info Toast
```typescript
toast.info("Already in cart", {
  description: "This item is already in your cart",
  action: {
    label: "View Cart",
    onClick: () => router.push("/cart"),
  },
});
```

**Result:**
- 💜 Soft lavender gradient background
- ℹ Info icon in lavender color
- Informative and non-disruptive

---

### Loading Toast
```typescript
const loadingToast = toast.loading("Processing payment...", {
  description: "Please wait while we process your order",
});

// Later, dismiss and show success
toast.dismiss(loadingToast);
toast.success("Payment successful!");
```

**Result:**
- 🌼 Soft cream gradient background
- ⟳ Animated spinner in rose color
- Smooth transition to success state

---

### Warning Toast
```typescript
toast.warning("Stock running low", {
  description: "Only 2 items left in stock",
});
```

**Result:**
- 🍑 Soft peach gradient background
- ⚠ Warning icon in peach color
- Attention-grabbing but gentle

## 🎨 Customization Options

### Per-Toast Styling

You can override styles for individual toasts:

```typescript
toast.success("Custom toast", {
  description: "With custom duration",
  duration: 6000, // 6 seconds instead of default 4
  position: "bottom-center", // Different position
});
```

### With Cancel Button

```typescript
toast("Confirm action", {
  description: "Are you sure you want to continue?",
  action: {
    label: "Confirm",
    onClick: () => {/* action */},
  },
  cancel: {
    label: "Cancel",
    onClick: () => toast.dismiss(),
  },
});
```

### Promise-Based Loading States

```typescript
toast.promise(
  saveUserProfile(data),
  {
    loading: "Saving profile...",
    success: "Profile saved successfully!",
    error: "Failed to save profile",
  }
);
```

## 🎭 Visual Comparison

### Before (Default Sonner)
- ❌ Generic gray backgrounds
- ❌ Small icons (16px)
- ❌ Basic borders
- ❌ No gradients
- ❌ Standard animations
- ❌ Doesn't match site theme

### After (Custom Theme)
- ✅ Soft, feminine color gradients
- ✅ Larger, more visible icons (20px)
- ✅ Elegant 2px borders with transparency
- ✅ Beautiful gradient backgrounds
- ✅ Smooth, polished animations
- ✅ Perfect match with site's aesthetic

## 🔧 Technical Details

### CSS Classes Applied

```css
.toast-custom          // Base toast container
.toast-title           // Toast title text
.toast-description     // Description text
.toast-action          // Action button
.toast-cancel          // Cancel button
.toast-close           // Close button
.toast-success         // Success variant
.toast-error           // Error variant
.toast-warning         // Warning variant
.toast-info            // Info variant
.toast-loading         // Loading variant
```

### Responsive Behavior

- Mobile: Full width on small screens
- Tablet: Fixed width with margins
- Desktop: Optimal 420px max-width
- All breakpoints have smooth animations

## 🌟 Best Practices

### Do's ✅
- Use descriptive titles and descriptions
- Include action buttons for quick navigation
- Keep messages concise and friendly
- Use appropriate toast types for context
- Dismiss loading toasts when complete

### Don'ts ❌
- Don't spam multiple toasts at once
- Don't use long messages (use modals instead)
- Don't forget to dismiss promise-based toasts
- Don't use errors for minor issues
- Don't set duration too short for reading

## 📊 Performance

- Lightweight: Only CSS and component updates
- Smooth animations: Hardware-accelerated transforms
- Accessible: ARIA labels and keyboard navigation
- Mobile-optimized: Touch-friendly hit targets

## 🎉 Final Result

Your toast notifications now perfectly match your website's:
- 🌸 Soft, feminine color palette
- 💫 Elegant animations and transitions
- 🎨 Consistent design language
- ✨ Professional polish and attention to detail

All toasts feel like a natural part of your eCommerce experience! 🛍️
