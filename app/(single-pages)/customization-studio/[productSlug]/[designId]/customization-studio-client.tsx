"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import Konva from "konva";
import { useProduct } from "@/lib/tanstack/queries/product.queries";
import { useDesign } from "@/lib/tanstack/queries/design.queries";
import { useCustomizationManager } from "@/hooks/use-customization";
import { useCartManager, createItemIdentifier } from "@/hooks/use-cart";
import { customizationApi } from "@/lib/api/customization";
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
import { Loader2, ShoppingCart, Save, ArrowLeft, RotateCw, Maximize2, LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

interface CustomizationStudioClientProps {
  productSlug: string;
  designId: string;
  variantId: string;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 700;

const THREAD_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Beige", hex: "#F5E6D3" },
  { name: "Rose", hex: "#FFB6C1" },
  { name: "Sky", hex: "#87CEEB" },
  { name: "Lavender", hex: "#DDA0DD" },
  { name: "Slate", hex: "#708090" },
  { name: "Black", hex: "#000000" },
];

const SIZES = ["S", "M", "L"];

export default function CustomizationStudioClient({
  productSlug,
  designId,
  variantId,
}: CustomizationStudioClientProps) {
  const router = useRouter();

  // Queries
  const { data: product, isLoading: productLoading } = useProduct(productSlug);
  const { data: design, isLoading: designLoading } = useDesign(designId);

  // Hooks
  const customization = useCustomizationManager(product?.id);
  const cart = useCartManager();

  // Canvas refs
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const designImageRef = useRef<Konva.Image>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [designImage, setDesignImage] = useState<HTMLImageElement | null>(null);
  const [selectedThreadColor, setSelectedThreadColor] = useState(THREAD_COLORS[0].hex);
  const [selectedSize, setSelectedSize] = useState("M");
  const [userMessage, setUserMessage] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedBaseImageIndex, setSelectedBaseImageIndex] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Dialog states
  const [showAddingDialog, setShowAddingDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [addingStep, setAddingStep] = useState<"preview" | "uploading" | "saving" | "adding">("preview");

  // Responsive canvas state
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  });

  // Design transform state
  const [designProps, setDesignProps] = useState({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 - 100,
    width: 200,
    height: 200,
    rotation: 0,
  });

  // Find selected variant
  const selectedVariant = product?.variants?.find((v) => v.id === variantId);

  // Get all PREVIEW_BASE images from variant
  const previewBaseImages =
    selectedVariant?.images?.filter(
      (img) => img.imageRole === "PREVIEW_BASE"
    ) || [];

  const currentBaseImageUrl = previewBaseImages[selectedBaseImageIndex]?.imageUrl;

  // ============================================================================
  // CART STATE CHECKING - USING NEW PROPERTY-BASED MATCHING
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
        userMessage: userMessage,
      })
    : false;

  // ============================================================================
  // INITIALIZATION - CHECK FOR EXISTING CUSTOMIZATION
  // ============================================================================

  // Initialize customization state on load
  useEffect(() => {
    if (!isInitialized && product && design && selectedVariant) {
      // Check if there's a matching customization already
      const matching = customization.matchingCustomization;
      
      if (matching) {
        console.log('[Studio] Found matching customization, loading:', matching);
        customization.loadCustomization(matching);
      } else {
        console.log('[Studio] No matching customization, initializing new');
        customization.initializeNew({
          designId: design.id,
          variantId: selectedVariant.id,
          threadColorHex: selectedThreadColor,
          userMessage: userMessage,
        });
      }
      
      setIsInitialized(true);
    }
  }, [product, design, selectedVariant, isInitialized, customization, selectedThreadColor, userMessage]);

  // Update customization state when thread color or message changes
    useEffect(() => {
      if (isInitialized && customization.currentState) {
        customization.updateCurrentState({
          threadColorHex: selectedThreadColor,
          userMessage: userMessage,
        });
      }
    }, [selectedThreadColor, userMessage, isInitialized, customization.updateCurrentState]);
  // ============================================================================
  // RESPONSIVE CANVAS
  // ============================================================================

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const scaleX = containerWidth / CANVAS_WIDTH;
      const scaleY = containerHeight / CANVAS_HEIGHT;
      const scale = Math.min(scaleX, scaleY, 1);

      setCanvasScale(scale);
      setCanvasDimensions({
        width: CANVAS_WIDTH * scale,
        height: CANVAS_HEIGHT * scale
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // ============================================================================
  // IMAGE LOADING
  // ============================================================================

  // Load base product image
  useEffect(() => {
    if (currentBaseImageUrl) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = currentBaseImageUrl;
      img.onload = () => setBaseImage(img);
      img.onerror = () => {
        console.error('[Studio] Failed to load base image');
        toast.error("Failed to load product image");
      };
    }
  }, [currentBaseImageUrl]);

  // Load design image
  useEffect(() => {
    if (design?.imageUrl) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = design.imageUrl;
      img.onload = () => {
        setDesignImage(img);
        const scale = Math.min(200 / img.width, 200 / img.height);
        setDesignProps(prev => ({
          ...prev,
          width: img.width * scale,
          height: img.height * scale,
        }));
        setIsSelected(true);
      };
      img.onerror = () => {
        console.error('[Studio] Failed to load design image');
        toast.error("Failed to load design image");
      };
    }
  }, [design]);

  // ============================================================================
  // TRANSFORMER HANDLING
  // ============================================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isSelected && designImageRef.current && transformerRef.current) {
        transformerRef.current.nodes([designImageRef.current]);
        transformerRef.current.getLayer()?.batchDraw();
      } else if (!isSelected && transformerRef.current) {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isSelected, designImage]);

  // ============================================================================
  // PREVIEW EXPORT & UPLOAD
  // ============================================================================

  const exportPreview = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!stageRef.current) {
        reject(new Error("Canvas not ready"));
        return;
      }

      // Deselect transformer
      setIsSelected(false);
      transformerRef.current?.nodes([]);

      setTimeout(() => {
        const stage = stageRef.current;
        if (!stage) {
          reject(new Error("Canvas not ready"));
          return;
        }

        try {
          stage.toBlob({
            callback: (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to export canvas"));
              }
            },
            mimeType: "image/png",
            quality: 1,
            pixelRatio: 2,
          });
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  };

  const uploadPreviewImage = async (blob: Blob): Promise<string> => {
    try {
      setUploadError(null);

      const file = new File([blob], "customization-preview.png", {
        type: "image/png",
      });

      console.log('[Studio] Uploading preview...');
      const previewImageUrl = await customizationApi.uploadPreviewImage(file);
      console.log('[Studio] Preview uploaded:', previewImageUrl);

      return previewImageUrl;
    } catch (error) {
      console.error('[Studio] Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUploadError(`Upload failed: ${errorMessage}`);
      throw new Error(`Failed to upload preview: ${errorMessage}`);
    }
  };

  // ============================================================================
  // SAVE CUSTOMIZATION (AUTHENTICATED USERS ONLY)
  // ============================================================================

  const handleSave = async () => {
    if (!product || !selectedVariant || !design) {
      toast.error("Missing required data");
      return;
    }

    if (!customization.isAuthenticated) {
      toast.error("Please sign in to save your design", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    setIsSaving(true);
    setUploadError(null);

    try {
      // Check if we can reuse existing preview
      let previewImageUrl: string;
      
      const currentState = customization.currentState;
      const isUpdate = currentState?.id && currentState.previewImageUrl;

      if (isUpdate) {
        previewImageUrl = currentState.previewImageUrl!;
        console.log('[Studio] Reusing existing preview');
      } else {
        console.log('[Studio] Generating new preview...');
        const blob = await exportPreview();
        previewImageUrl = await uploadPreviewImage(blob);
      }

      // Save to backend
      const result = await customization.save({
        productId: product.id,
        variantId: selectedVariant.id,
        designId: design.id,
        threadColorHex: selectedThreadColor,
        userMessage: userMessage,
        previewImageUrl,
      });

      toast.success(
        isUpdate ? "Design updated!" : "Design saved!",
        { duration: 3000 }
      );

      console.log('[Studio] Saved customization:', result);
    } catch (error) {
      console.error('[Studio] Save failed:', error);

      if (error instanceof Error) {
        if (error.message.includes('Must be logged in')) {
          toast.error("Please sign in to save", {
            action: {
              label: "Sign In",
              onClick: () => router.push("/login"),
            },
          });
        } else if (error.message.includes('upload')) {
          toast.error("Failed to upload preview. Try again.");
        } else {
          toast.error(`Save failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // ADD TO CART - PROPERLY USING NEW CART MANAGER
  // ============================================================================

  const handleAddToCart = async () => {
    if (!product || !selectedVariant || !design) {
      toast.error("Missing required data");
      return;
    }

    setIsAddingToCart(true);
    setUploadError(null);

    try {
      const threadColorName = THREAD_COLORS.find(c => c.hex === selectedThreadColor)?.name || selectedThreadColor;
      const customizationSummary = userMessage.trim() 
        ? `${design.name} - ${threadColorName} | Message: ${userMessage.trim()}`
        : `${design.name} - ${threadColorName}`;

      if (cart.isAuthenticated) {
        // ================== AUTHENTICATED USER ==================
        setShowAddingDialog(true);

        let savedCustomizationId: string;
        
        const currentState = customization.currentState;
        const needsSave = !currentState?.id;

        // Save customization if not saved yet
        if (needsSave) {
          setAddingStep("preview");
          const blob = await exportPreview();

          setAddingStep("uploading");
          const previewImageUrl = await uploadPreviewImage(blob);

          setAddingStep("saving");
          const result = await customization.save({
            productId: product.id,
            variantId: selectedVariant.id,
            designId: design.id,
            threadColorHex: selectedThreadColor,
            userMessage: userMessage,
            previewImageUrl,
          });

          savedCustomizationId = result.id;
        } else {
          savedCustomizationId = currentState.id!;
        }

        // Add to cart using new API
        setAddingStep("adding");
        await cart.addItem({
          productId: product.id,
          productVariantId: selectedVariant.id,
          customizationId: savedCustomizationId,
          productSlug: product.slug,
          quantity: 1,
          customizationSummary,
        });

        setShowAddingDialog(false);
        setShowSuccessDialog(true);

      } else {
        // ================== GUEST USER ==================
       setShowAddingDialog(true);

      setAddingStep("preview");
      const blob = await exportPreview();

      // Convert to base64
      const base64Preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      setAddingStep("adding");

      // ✅ CRITICAL: For guests, use localCartManager directly
      // because AddToCartRequest doesn't have customizationData field
      const { localCartManager } = await import("@/lib/utils/local-cart");
      
      localCartManager.addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
        customizationId: null,
        productSlug: product.slug,
        customizationSummary,
        customizationData: {
          designId: design.id,
          threadColorHex: selectedThreadColor,
          previewImageBase64: base64Preview,
          designPositionJson: JSON.stringify(designProps),
        },
      });

      // Trigger cart refresh
      cart.refresh();

      setShowAddingDialog(false);
      setShowSuccessDialog(true);
      }

    } catch (error) {
      console.error('[Studio] Add to cart failed:', error);
      setShowAddingDialog(false);

      if (error instanceof Error) {
        if (error.message.includes('upload')) {
          toast.error("Failed to upload preview. Try again.");
        } else {
          toast.error(`Add to cart failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to add to cart. Try again.");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ============================================================================
  // MOBILE CONTROLS
  // ============================================================================

  const handleRotate = () => {
    setDesignProps(prev => ({
      ...prev,
      rotation: (prev.rotation + 15) % 360
    }));
  };

  const handleResize = (factor: number) => {
    setDesignProps(prev => ({
      ...prev,
      width: Math.max(50, Math.min(CANVAS_WIDTH, prev.width * factor)),
      height: Math.max(50, Math.min(CANVAS_HEIGHT, prev.height * factor))
    }));
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (productLoading || designLoading) {
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

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-12 md:h-14 border-b bg-background flex items-center justify-between px-3 md:px-4 shrink-0">
        {/* Left: Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-foreground hover:text-foreground/80 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs md:text-sm font-medium">Back</span>
        </button>

        {/* Center: Product Name */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <h1 className="text-sm font-medium text-foreground">{product.name}</h1>
        </div>

        {/* Right: Save Button */}
        {customization.isAuthenticated ? (
          <Button
            onClick={handleSave}
            disabled={isSaving || customization.isSaving}
            variant={customization.currentState?.id ? "outline" : "default"}
            size="sm"
            className="gap-1.5 h-8"
          >
            {isSaving || customization.isSaving ? (
              <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">
                  {customization.currentState?.id ? "Saved" : "Save"}
                </span>
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            size="sm"
            className="gap-1.5 h-8"
          >
            <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm">Sign In to Save</span>
          </Button>
        )}
      </header>

      {/* Guest User Alert */}
      {!customization.isAuthenticated && (
        <div className="px-3 md:px-4 pt-2">
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
              Sign in to save your designs and access them anytime.{" "}
              <button
                onClick={() => router.push("/login")}
                className="font-medium underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-100"
              >
                Sign in now
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="px-3 md:px-4 pt-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs md:text-sm">
              {uploadError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Studio */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-2 lg:gap-3 p-2 lg:p-4 overflow-hidden min-h-0">
          {/* Thumbnail Gallery */}
          {previewBaseImages.length > 1 && (
            <div className="flex lg:flex-col gap-1.5 lg:gap-3 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
              <span className="hidden lg:block text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap">
                Views
              </span>
              {previewBaseImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedBaseImageIndex(index)}
                  className={`relative w-12 h-14 lg:w-16 lg:h-20 shrink-0 rounded border-2 overflow-hidden transition-all ${selectedBaseImageIndex === index
                      ? "border-foreground shadow-md"
                      : "border-border hover:border-foreground/50"
                    }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedBaseImageIndex === index && (
                    <div className="absolute inset-0 bg-foreground/10" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Canvas Container */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div
              ref={containerRef}
              className="flex-1 rounded-lg border bg-muted/20 flex items-center justify-center overflow-hidden touch-none"
            >
              <Stage
                ref={stageRef}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                scaleX={canvasScale}
                scaleY={canvasScale}
                onMouseDown={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  const clickedOnBaseImage = e.target.getClassName() === 'Image' && e.target !== designImageRef.current;
                  if (clickedOnEmpty || clickedOnBaseImage) {
                    setIsSelected(false);
                  }
                }}
                onTouchStart={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  const clickedOnBaseImage = e.target.getClassName() === 'Image' && e.target !== designImageRef.current;
                  if (clickedOnEmpty || clickedOnBaseImage) {
                    setIsSelected(false);
                  }
                }}
              >
                <Layer>
                  {baseImage && (
                    <KonvaImage
                      image={baseImage}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                    />
                  )}
                  {designImage && (
                    <>
                      <KonvaImage
                        ref={designImageRef}
                        image={designImage}
                        x={designProps.x}
                        y={designProps.y}
                        width={designProps.width}
                        height={designProps.height}
                        rotation={designProps.rotation}
                        offsetX={designProps.width / 2}
                        offsetY={designProps.height / 2}
                        draggable
                        onClick={() => setIsSelected(true)}
                        onTap={() => setIsSelected(true)}
                        onDragEnd={(e) => {
                          setDesignProps({
                            ...designProps,
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = designImageRef.current;
                          if (!node) return;

                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();

                          const newWidth = Math.max(50, node.width() * scaleX);
                          const newHeight = Math.max(50, node.height() * scaleY);

                          node.scaleX(1);
                          node.scaleY(1);

                          setDesignProps({
                            x: node.x(),
                            y: node.y(),
                            width: newWidth,
                            height: newHeight,
                            rotation: node.rotation(),
                          });
                        }}
                      />
                      <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                          if (newBox.width < 50 || newBox.height < 50) return oldBox;
                          if (newBox.width > CANVAS_WIDTH || newBox.height > CANVAS_HEIGHT) return oldBox;
                          return newBox;
                        }}
                        rotateEnabled={true}
                        keepRatio={true}
                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                        anchorSize={window.innerWidth < 768 ? 20 : 12}
                        anchorCornerRadius={window.innerWidth < 768 ? 10 : 6}
                        borderStroke="#000000"
                        borderStrokeWidth={2}
                        anchorStroke="#000000"
                        anchorFill="#ffffff"
                      />
                    </>
                  )}
                </Layer>
              </Stage>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center justify-center gap-2 py-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResize(0.9)}
                disabled={!isSelected}
                className="gap-1.5 h-8 text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Smaller
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                disabled={!isSelected}
                className="gap-1.5 h-8 text-xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Rotate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResize(1.1)}
                disabled={!isSelected}
                className="gap-1.5 h-8 text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Larger
              </Button>
            </div>

            {/* Canvas Instructions */}
            <div className="text-center text-[10px] md:text-xs text-muted-foreground px-2">
              {isSelected ? (
                <>
                  <span className="hidden lg:inline">✓ Design selected • Drag corners to resize • Rotate with handle</span>
                  <span className="lg:hidden">✓ Selected • Drag to move</span>
                </>
              ) : (
                <>
                  <span className="hidden lg:inline">Click design to select • Drag to move • Corners to resize</span>
                  <span className="lg:hidden">Tap to select</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Tool Panel */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-background overflow-y-auto shrink-0 max-h-[35vh] lg:max-h-none">
          <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
            {/* Design Info */}
            <div className="flex items-center gap-2.5">
              {design?.imageUrl && (
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded border object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs lg:text-sm truncate">{design?.name}</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground">Design Pattern</p>
              </div>
            </div>

            {/* Variant Info */}
            <div className="flex items-center gap-2.5 pb-3 border-b">
              {selectedVariant?.images?.[0] && (
                <img
                  src={selectedVariant.images[0].imageUrl}
                  alt={selectedVariant.color}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded border object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] lg:text-xs text-muted-foreground">Base Color</p>
                <p className="font-medium text-xs lg:text-sm">{selectedVariant?.color}</p>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <label className="text-xs lg:text-sm font-medium">Size</label>
              <div className="flex gap-1.5 lg:gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 h-8 lg:h-9 rounded border text-xs lg:text-sm font-normal transition-all ${selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground/50"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Thread Color */}
            <div className="space-y-2">
              <label className="text-xs lg:text-sm font-medium">Thread Color</label>
              <div className="grid grid-cols-7 gap-1.5 lg:gap-2">
                {THREAD_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedThreadColor(color.hex)}
                    className={`relative w-full aspect-square rounded border-2 transition-all ${selectedThreadColor === color.hex
                        ? "border-foreground scale-95"
                        : "border-border hover:border-foreground/30"
                      }`}
                    title={color.name}
                  >
                    <div
                      className="w-full h-full rounded-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    {selectedThreadColor === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* User Message */}
            <div className="space-y-2">
              <label className="text-xs lg:text-sm font-medium">
                Add a Message (Optional)
              </label>
              <Textarea
                value={userMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserMessage(e.target.value)}
                placeholder="Enter your custom message here..."
                className="min-h-15 lg:min-h-20 text-xs lg:text-sm resize-none"
                maxLength={200}
              />
              <p className="text-[10px] lg:text-xs text-muted-foreground text-right">
                {userMessage.length}/200
              </p>
            </div>

            {/* Note */}
            <div className="text-[10px] lg:text-xs text-muted-foreground pt-2 border-t">
              *Embroidery included in price
            </div>
          </div>
        </aside>
      </div>

      {/* Fixed Bottom */}
      <div className="border-t bg-background p-2.5 lg:p-4 shrink-0">
        <div className="max-w-md mx-auto space-y-1.5 lg:space-y-2">
          <Button
            onClick={isItemInCart ? () => router.push("/cart") : handleAddToCart}
            disabled={!isItemInCart && (isAddingToCart || cart.isAdding)}
            className="w-full h-10 lg:h-12 text-sm lg:text-base gap-2"
            size="lg"
            variant={isItemInCart ? "outline" : "default"}
          >
            {isItemInCart ? (
              <>
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                View Cart
              </>
            ) : isAddingToCart || cart.isAdding ? (
              <>
                <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                Add to Cart • ₹{product.basePrice}
              </>
            )}
          </Button>
          <p className="text-[10px] lg:text-xs text-center text-muted-foreground">
            {customization.isAuthenticated ? (
              <>Auto-saved • Free shipping on orders above ₹999</>
            ) : (
              <>Design auto-saved locally • Free shipping on orders above ₹999</>
            )}
          </p>
        </div>
      </div>

      {/* Adding to Cart Progress Dialog */}
      <Dialog open={showAddingDialog} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding to Cart
            </DialogTitle>
            <DialogDescription>
              {addingStep === "preview" && "Generating preview image..."}
              {addingStep === "uploading" && "Uploading preview..."}
              {addingStep === "saving" && "Saving your design..."}
              {addingStep === "adding" && "Adding to your cart..."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              Added to Cart!
            </DialogTitle>
            <DialogDescription>
              {customization.isAuthenticated
                ? "Your customized item has been added to your cart."
                : "Your design is saved locally. Sign in at checkout to finalize your order."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:flex-col gap-2">
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
              Continue Designing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In Required
            </DialogTitle>
            <DialogDescription>
              Please sign in to save your custom design and add it to your cart.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:flex-col gap-2">
            <Button
              onClick={() => {
                setShowLoginDialog(false);
                router.push("/login");
              }}
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setShowLoginDialog(false)}
              variant="outline"
              className="w-full"
            >
              Continue as Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}