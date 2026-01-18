# Customization System Refactor

## Overview
This document describes the refactoring of the customization system to remove the draft concept and improve cart detection logic.

## Changes Made

### 1. Removed Draft Concept from `use-customization.ts`

**Before:**
- Used localStorage to persist draft state with `DraftState` interface
- Had `saveDraft()`, `clearDraft()`, `hasUnsavedChanges()` methods
- Maintained separate `savedState` and `localDraft` tracking
- Complex state management with design transforms

**After:**
- Simple `CurrentCustomizationState` interface tracks working state
- No localStorage persistence for drafts
- Single source of truth: `productCustomizationsQuery` from backend
- Clean state management focused on current work

**New Interface:**
```typescript
interface CurrentCustomizationState {
  id: string | null;
  designId: UUID;
  variantId: UUID;
  threadColorHex: string;
  userMessage?: string;
  previewImageUrl?: string;
}
```

### 2. Property-Based Customization Matching

**Problem:** 
When reopening a product with the same design, the system showed "Add to Cart" instead of "In Cart" because it checked `customizationId`, which didn't exist for unsaved work.

**Solution:**
- Match customizations by properties: `designId + variantId + threadColorHex + userMessage`
- `findMatchingCustomization()` - Finds existing customization with same properties
- `getExistingCustomizationsForDesign()` - Lists all customizations for current design

**Benefits:**
- Detects existing customizations even before saving
- Prevents duplicate customizations with same properties
- Better UX - users can see and select their previous customizations

### 3. Updated Cart Detection Logic

**File:** `hooks/use-cart.ts`

**Before:**
```typescript
const customizationMatch = itemIdentifier.customizationId
  ? item.customization?.id === itemIdentifier.customizationId
  : !item.customization;
```

**After:**
```typescript
// For customized items, match by properties
if (itemIdentifier.designId) {
  const customization = item.customization;
  if (!customization) return false;
  
  const designMatch = customization.designId === itemIdentifier.designId;
  const threadColorMatch = customization.threadColorHex === itemIdentifier.threadColorHex;
  const messageMatch = (customization.userMessage || '') === (itemIdentifier.userMessage || '');
  
  return productMatch && variantMatch && designMatch && threadColorMatch && messageMatch;
}
```

**Result:**
- Accurate detection of customized items in cart
- Works for both saved and unsaved customizations
- No false negatives when reopening same design

### 4. Added User Message Support

**New Field:** `userMessage` (optional string, max 200 characters)

**Updated Types:**
- `CustomizationRequest` - Added `userMessage?: string`
- `CustomizationSummary` - Added `userMessage?: string`
- `CartItemIdentifier` - Added `userMessage?: string`

**Integration:**
- User message included in customization matching
- Message appended to customizationSummary as "Design - Color | Message: text"
- Stored with customization in backend

### 5. New Hook API

**`use-customization.ts` exports:**

```typescript
{
  // Current state
  currentState: CurrentCustomizationState | null,
  
  // Existing customizations for this design
  existingCustomizations: Customization[],
  matchingCustomization: Customization | null,
  
  // User info
  isAuthenticated: boolean,
  userId?: string,

  // Loading states
  isLoadingCustomizations: boolean,
  isSaving: boolean,
  isDeleting: boolean,

  // Actions
  initializeNew: (data) => void,
  updateCurrentState: (updates) => void,
  loadCustomization: (customization) => void,
  clear: () => void,
  save: (data) => Promise<SaveCustomizationResponse>,
  createTempForCart: (data) => Promise<any>,
  delete: (id) => Promise<void>,
  refresh: () => void,
}
```

## Migration Guide for Components

### Before (Old API):
```typescript
const {
  localDraft,
  savedState,
  saveDraft,
  clearDraft,
  hasUnsavedChanges,
  save
} = useCustomizationManager();

// Save draft to localStorage
saveDraft({
  designId,
  variantId,
  threadColorHex,
  designTransform: { x, y, width, height, rotation }
});

// Check if saved
const isSaved = !!savedState;
```

### After (New API):
```typescript
const {
  currentState,
  matchingCustomization,
  initializeNew,
  updateCurrentState,
  save
} = useCustomizationManager();

// Initialize new customization
initializeNew({
  designId,
  variantId,
  threadColorHex,
  userMessage
});

// Update state
updateCurrentState({
  threadColorHex: newColor,
  userMessage: newMessage
});

// Check if already in cart
const isInCart = !!matchingCustomization;
```

## Testing Recommendations

1. **Cart Detection:**
   - Open product with design A, select color red, message "test"
   - Add to cart
   - Navigate away and return to same product/design
   - Select color red, message "test" again
   - Should show "In Cart" instead of "Add to Cart"

2. **Customization Matching:**
   - Create customization with specific design/color/message
   - Save it
   - Change to different color
   - Change back to original color and message
   - Should detect existing customization

3. **Guest vs Authenticated:**
   - Test both guest and authenticated user flows
   - Guest: `createTempForCart()` should work
   - Authenticated: `save()` should persist to backend

## Files Modified

- ✅ `hooks/use-customization.ts` - Complete refactor
- ✅ `hooks/use-cart.ts` - Updated isInCart logic
- ✅ `types/index.ts` - Added userMessage to interfaces
- ⏳ `components/customization/customization-studio-client.tsx` - Needs update

## Next Steps

1. Update `customization-studio-client.tsx` to use new hook API
2. Remove draft-related UI/state from studio client
3. Add UI to show existing customizations for selection
4. Test complete flow: initialize → update → save → detect in cart
