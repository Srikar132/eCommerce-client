"use client";
import { useState } from "react";
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
import Image from "next/image";

interface CustomizationStudioClientProps {
  productSlug: string;
  designId: string;
  variantId: string;
}

const THREAD_COLORS = [
  { name: "Champagne Cream", hex: "#F5E6D3" },
  { name: "Rose", hex: "#FFB7B2" },
  { name: "Sky", hex: "#B2E2F2" },
  { name: "Lavender", hex: "#D8B4E2" },
  { name: "Slate", hex: "#7D8C9C" },
  { name: "Black", hex: "#1A1A1A" },
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Find selected variant
  const selectedVariant = variants?.find((v) => v.id === variantId);

  // Get variant image
  const variantImageUrl = selectedVariant?.images?.[0]?.imageUrl;

  // Check if in cart
  const isItemInCart = product && selectedVariant && design
    ? cart.isInCart({
        productId: product.id,
        variantId: selectedVariant.id,
        designId: design.id,
        threadColorHex: selectedThreadColor,
        additionalNotes: userMessage.trim(),
      })
    : false;

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product || !selectedVariant || !design) {
      toast.error("Missing required data");
      return;
    }

    setIsAddingToCart(true);

    try {
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

  // Loading state
  if (productLoading || designLoading || variantsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product || !design || !selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-slate-500">Product or design not found</p>
      </div>
    );
  }

  // Calculate total
  const totalPrice = product.basePrice + (selectedVariant.additionalPrice || 0) + design.designPrice;
  const selectedThreadColorName = THREAD_COLORS.find(c => c.hex === selectedThreadColor)?.name || "Custom";

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-800 /80 dark:bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="hidden md:block italic font-display text-lg text-slate-600 dark:text-slate-400">
            {product.name}
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Preview Images */}
          <div className="lg:col-span-7 space-y-10">
            {/* Title Section */}
            <div className="space-y-4">
              <h1 className="text-4xl font-display italic text-slate-800 dark:text-slate-200">
                Customize Your Design
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg">
                Preview your customization with the selected design and thread color. Our artisans hand-finish every piece.
              </p>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Base Product */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                    Base Product
                  </span>
                </div>
                <div className="aspect-4/5 rounded-xl overflow-hidden  dark:bg-card-dark border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md relative">
                  {variantImageUrl ? (
                    <Image
                      src={variantImageUrl}
                      alt={`${product.name} - ${selectedVariant.color}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="material-icons-outlined text-6xl">checkroom</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedVariant.color}
                  </p>
                  <p className="text-sm text-slate-500">Size: {selectedVariant.size}</p>
                </div>
              </div>

              {/* Selected Design */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                    Selected Embroidery
                  </span>
                </div>
                <div className="aspect-4/5 rounded-xl overflow-hidden  dark:bg-card-dark border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group relative">
                  {design.designImageUrl ? (
                    <Image
                      src={design.designImageUrl}
                      alt={design.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="material-icons-outlined text-6xl">palette</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="text-center">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {design.name}
                  </p>
                  <p className="text-sm text-slate-500">Category: {design.category?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Customization Options */}
          <div className="lg:col-span-5">
            <div className=" dark:bg-card-dark rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-28">
              {/* Header */}
              <h2 className="text-2xl font-display italic mb-1 text-slate-800 dark:text-slate-200">
                Customization Options
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                Choose your thread color and add a personal message for our craftsmen.
              </p>

              {/* Thread Color Selection */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Thread Color
                  </label>
                  <span className="text-xs text-primary font-medium">
                    Selected: {selectedThreadColorName}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {THREAD_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedThreadColor(color.hex)}
                      className={`w-10 h-10 rounded-full p-0.5 ring-2 ring-transparent ring-offset-2 dark:ring-offset-card-dark transition-all hover:scale-110 ${
                        selectedThreadColor === color.hex
                          ? "border-2 border-primary ring-primary/30"
                          : "border border-slate-200 dark:border-slate-700"
                      }`}
                      title={color.name}
                    >
                      <div
                        className="w-full h-full rounded-full shadow-inner flex items-center justify-center thread-texture"
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedThreadColor === color.hex && (
                          <span className="material-icons-outlined text-sm text-slate-700">
                            check
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="mb-10">
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Message for the Artisan{" "}
                    <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                    {userMessage.length} / 200
                  </span>
                </div>
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-4 text-sm min-h-30 placeholder:text-slate-400 transition-all resize-none"
                  placeholder="Add a personal touch or specific placement notes for the artisan to consider while embroidering..."
                  maxLength={200}
                />
              </div>

              {/* Price Summary */}
              <div className="space-y-3 mb-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base Product Price</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    ₹{product.basePrice}.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Custom Embroidery</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    ₹{design.designPrice}.00
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-display italic font-bold text-slate-800 dark:text-slate-200">
                    Total Amount
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{totalPrice}.00
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={isItemInCart ? () => router.push("/cart") : handleAddToCart}
                disabled={!isItemInCart && (isAddingToCart || cart.isAdding)}
                className="w-full bg-primary hover:bg-[#D47981] text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 h-auto"
              >
                {isItemInCart ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Already in Bag - View Cart
                  </>
                ) : isAddingToCart || cart.isAdding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding to Bag...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Bag — ₹{totalPrice}
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-slate-400 mt-6 uppercase tracking-wider">
                Free express shipping on all custom orders above ₹999
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

