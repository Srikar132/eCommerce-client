"use client";
import { useEffect, useState } from "react";
import { useProduct, useProductVariants } from "@/lib/tanstack/queries/product.queries";
import { useDesign } from "@/lib/tanstack/queries/design.queries";
import { useCartManager } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, ShoppingCart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CustomizationStudioClientProps {
  productSlug: string;
  designId: string;
  variantId: string;
}

const THREAD_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Beige", hex: "#F5E6D3" },
  { name: "Rose", hex: "#FFB6C1" },
  { name: "Sky", hex: "#87CEEB" },
  { name: "Lavender", hex: "#DDA0DD" },
  { name: "Slate", hex: "#708090" },
  { name: "Black", hex: "#000000" },
];

export default function CustomizationStudioClient({
  productSlug,
  designId,
  variantId,
}: CustomizationStudioClientProps) {
  const router = useRouter();

  // Queries
  const { data: product, isLoading: productLoading } = useProduct(productSlug);
  const { data: variants, isLoading: variantsLoading } = useProductVariants(productSlug, { enabled: !!productSlug });
  const { data: design, isLoading: designLoading } = useDesign(designId);

  // Hooks
  const cart = useCartManager();

  // State
  const [selectedThreadColor, setSelectedThreadColor] = useState(THREAD_COLORS[0].hex);
  const [userMessage, setUserMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Find selected variant from variants array
  const selectedVariant = variants?.find((v) => v.id === variantId);

  // Get the first variant image for display
  const variantImageUrl = selectedVariant?.images?.[0]?.imageUrl;

  // ============================================================================
  // CART STATE CHECKING
  // ============================================================================

  /**
   * Check if this exact customization is in cart
   * Uses property matching (design + variant + threadColor + message)
   */
  const isItemInCart = product && selectedVariant && design
    ? cart.isInCart({
        productId: product.id,
        variantId: selectedVariant.id,
        designId: design.id,
        threadColorHex: selectedThreadColor,
        additionalNotes: userMessage.trim(),
      })
    : false;

  // ============================================================================
  // ADD TO CART - SIMPLIFIED
  // ============================================================================

  const handleAddToCart = async () => {
    if (!product || !selectedVariant || !design) {
      toast.error("Missing required data");
      return;
    }

    setIsAddingToCart(true);

    try {
      // Add to cart with inline customization data
      await cart.addItem({
        productId: product.id,
        productVariantId: selectedVariant.id,
        quantity: 1,
        productSlug: product.slug,
        productName: product.name,
        variantSize: selectedVariant.size,
        variantColor: selectedVariant.color,
        variantImageUrl: selectedVariant.images?.[0]?.imageUrl || '',
        basePrice: product.basePrice,
        variantPrice: selectedVariant.additionalPrice,
        customizationData: {
          designId: design.id,
          designPrice: design.designPrice,
          threadColorHex: selectedThreadColor,
          additionalNotes: userMessage.trim(),
        },
      });

      setShowSuccessDialog(true);
    } catch (error) {
      console.error('[Studio] Add to cart failed:', error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (productLoading || designLoading || variantsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!product || !design || !selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product or design not found</p>
      </div>
    );
  }

  // Calculate total price
  const totalPrice = product.basePrice + (selectedVariant.additionalPrice || 0) + design.designPrice;
  const selectedThreadColorName = THREAD_COLORS.find(c => c.hex === selectedThreadColor)?.name || "Custom";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-lg font-semibold hidden md:block">{product.name}</h1>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images Preview */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Customize Your Design</h2>
              <p className="text-muted-foreground">
                Preview your customization with the selected design and thread color
              </p>
            </div>

            {/* Product Variant Image */}
            <div className="rounded-lg border bg-muted/20 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm font-medium text-muted-foreground">Base Product</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              
              {variantImageUrl && (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={variantImageUrl}
                    alt={`${product.name} - ${selectedVariant.color}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="text-center">
                <p className="font-medium">{selectedVariant.color}</p>
                <p className="text-sm text-muted-foreground">Size: {selectedVariant.size}</p>
              </div>
            </div>

            {/* Design Image */}
            <div className="rounded-lg border bg-muted/20 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm font-medium text-muted-foreground">Selected Design</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {design.designImageUrl && (
                <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden bg-white">
                  <img
                    src={design.designImageUrl}
                    alt={design.name}
                    className="w-full h-full object-contain p-8"
                  />
                </div>
              )}

              <div className="text-center">
                <p className="font-medium">{design.name}</p>
                <p className="text-sm text-muted-foreground">
                  Thread Color: {selectedThreadColorName}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Customization Form */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Customization Options</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your thread color and add a personal message
                </p>
              </div>

              {/* Thread Color Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Thread Color</Label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {THREAD_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedThreadColor(color.hex)}
                      className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedThreadColor === color.hex
                          ? "border-foreground ring-2 ring-foreground ring-offset-2"
                          : "border-border hover:border-foreground/50"
                      }`}
                      title={color.name}
                    >
                      <div
                        className="w-full h-full rounded-md"
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedThreadColor === color.hex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-foreground drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium">{selectedThreadColorName}</span>
                </p>
              </div>

              {/* User Message */}
              <div className="space-y-3">
                <Label htmlFor="message" className="text-base font-medium">
                  Personal Message <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="message"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Add a personal message to be embroidered..."
                  className="min-h-25 resize-none"
                  maxLength={200}
                />
                <div className="flex justify-between text-sm">
                  <p className="text-muted-foreground">
                    Your message will be embroidered with care
                  </p>
                  <p className="text-muted-foreground">
                    {userMessage.length}/200
                  </p>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Price</span>
                  <span>₹{product.basePrice}</span>
                </div>
                {selectedVariant.additionalPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Variant</span>
                    <span>₹{selectedVariant.additionalPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Design</span>
                  <span>₹{design.designPrice}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={isItemInCart ? () => router.push("/cart") : handleAddToCart}
                disabled={!isItemInCart && (isAddingToCart || cart.isAdding)}
                className="w-full h-12 text-base gap-2"
                size="lg"
                variant={isItemInCart ? "outline" : "default"}
              >
                {isItemInCart ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Already in Cart - View Cart
                  </>
                ) : isAddingToCart || cart.isAdding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart - ₹{totalPrice}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Free shipping on orders above ₹999 • Embroidery included
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              Added to Cart!
            </DialogTitle>
            <DialogDescription className="pt-2">
              Your customized {product.name} with {design.name} design has been added to your cart.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                router.push("/cart");
              }}
              className="w-full"
            >
              View Cart
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                router.push("/checkout");
              }}
              variant="outline"
              className="w-full"
            >
              Checkout Now
            </Button>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              variant="ghost"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}