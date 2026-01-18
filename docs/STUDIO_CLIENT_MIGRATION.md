# Customization Studio Client Migration

## Overview
Updated `customization-studio-client.tsx` to use the new clean customization hook API after removing the draft concept.

## Changes Made

### 1. Removed Draft System References

**Before:**
- Used `hasRestoredRef` to track draft restoration
- Referenced `customization.localDraft`
- Called `customization.saveDraft()`
- Used `customization.savedState`
- Checked `customization.hasUnsavedChanges`
- Checked `customization.isSaved`

**After:**
- Removed `hasRestoredRef` completely
- Uses `customization.currentState`
- Calls `customization.initializeNew()` and `customization.updateCurrentState()`
- Uses `customization.matchingCustomization` for detection
- Simplified state management

### 2. Updated Initialization Logic

**Old Draft Restoration:**
```typescript
useEffect(() => {
  if (!hasRestoredRef.current && customization.localDraft && product && design) {
    const draft = customization.localDraft;
    // Restore transform, threadColor, userMessage from draft
    hasRestoredRef.current = true;
  }
}, [customization.localDraft, product, design]);

// Auto-save debounced
const debouncedSaveDraft = useCallback(
  debounce(() => {
    customization.saveDraft({
      designTransform: designProps,
      threadColorHex: selectedThreadColor,
      userMessage: userMessage,
    });
  }, 3000),
  [designProps, selectedThreadColor, userMessage]
);
```

**New Initialization:**
```typescript
useEffect(() => {
  if (!isInitialized && product && design && selectedVariant) {
    const matching = customization.matchingCustomization;
    
    if (matching) {
      customization.loadCustomization(matching);
    } else {
      customization.initializeNew({
        designId: design.id,
        variantId: selectedVariant.id,
        threadColorHex: selectedThreadColor,
        userMessage: userMessage,
      });
    }
    
    setIsInitialized(true);
  }
}, [product, design, selectedVariant, isInitialized]);

// Update state when properties change
useEffect(() => {
  if (isInitialized && customization.currentState) {
    customization.updateCurrentState({
      threadColorHex: selectedThreadColor,
      userMessage: userMessage,
    });
  }
}, [selectedThreadColor, userMessage, isInitialized]);
```

### 3. Updated Cart Detection

**Old (ID-based):**
```typescript
const isItemInCart = cart.isInCart({
  productId: product.id,
  variantId: selectedVariant.id,
  customizationId: customization.savedState?.id || null,
  designId: design.id,
  threadColorHex: selectedThreadColor,
});
```

**New (Property-based):**
```typescript
const isItemInCart = cart.isInCart({
  productId: product.id,
  variantId: selectedVariant.id,
  designId: design.id,
  threadColorHex: selectedThreadColor,
  userMessage: userMessage,
});
```

### 4. Updated Save Handler

**Old:**
```typescript
// Check if we need new preview
if (customization.isSaved && !customization.hasUnsavedChanges) {
  previewImageUrl = customization.savedState!.previewImageUrl;
}

// Save
await customization.save({
  productId, variantId, designId, threadColorHex, previewImageUrl
});

toast.success(
  customization.isSaved ? "Design updated!" : "Design saved!"
);
```

**New:**
```typescript
const currentState = customization.currentState;
const isUpdate = currentState?.id && currentState.previewImageUrl;

if (isUpdate) {
  previewImageUrl = currentState.previewImageUrl!;
}

// Save
await customization.save({
  productId, variantId, designId, threadColorHex, userMessage, previewImageUrl
});

toast.success(
  isUpdate ? "Design updated!" : "Design saved!"
);
```

### 5. Updated Add to Cart Handler

**Old:**
```typescript
// Save customization if not saved or has changes
if (!customization.isSaved || customization.hasUnsavedChanges) {
  // Generate preview and save
  savedCustomizationId = result.id;
} else {
  savedCustomizationId = customization.savedState!.id;
}
```

**New:**
```typescript
const currentState = customization.currentState;
const needsSave = !currentState?.id;

if (needsSave) {
  // Generate preview and save
  savedCustomizationId = result.id;
} else {
  savedCustomizationId = currentState.id!;
}
```

### 6. Updated UI Elements

**Save Button:**
```typescript
// Old
variant={customization.hasUnsavedChanges ? "default" : "outline"}
{customization.isSaved
  ? (customization.hasUnsavedChanges ? "Save Changes" : "Saved")
  : "Save"}

// New
variant={customization.currentState?.id ? "outline" : "default"}
{customization.currentState?.id ? "Saved" : "Save"}
```

**Canvas Instructions:**
```typescript
// Old - showed unsaved changes indicator
{customization.isAuthenticated && customization.hasUnsavedChanges && (
  <span>• Unsaved changes</span>
)}

// New - removed (no longer tracking unsaved changes)
```

## Benefits

1. **Simpler State Management** - No localStorage draft persistence, just current working state
2. **Better Cart Detection** - Property-based matching works for both saved and unsaved customizations
3. **Cleaner Code** - Removed complex draft restoration logic
4. **Single Source of Truth** - `productCustomizationsQuery` from backend is the authority
5. **No False Negatives** - Cart detection works correctly when reopening same design

## Testing Checklist

- [ ] Initialize new customization
- [ ] Change thread color and message - should update currentState
- [ ] Save customization - should get ID
- [ ] Reopen same product/design - should detect existing customization
- [ ] Cart detection works for exact matches
- [ ] Add to cart saves if needed
- [ ] Guest user flow still works with local cart
- [ ] Save button shows correct state (Saved vs Save)

## Migration Impact

- **Breaking**: No more localStorage draft persistence
- **Breaking**: No `hasUnsavedChanges` indicator in UI
- **Improved**: Cart detection is more accurate
- **Improved**: Simpler initialization flow
