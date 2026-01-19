"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Toast Preview Component
 * 
 * This component lets you preview all the custom toast variants.
 * Add this to any page to test the toast designs.
 * 
 * Usage:
 * import { ToastPreview } from "@/components/toast-preview";
 * <ToastPreview />
 */
export function ToastPreview() {
  const router = useRouter();

  const showSuccessToast = () => {
    toast.success("Added to cart!", {
      description: "Item added successfully to your shopping cart",
      action: {
        label: "View Cart",
        onClick: () => console.log("View cart clicked"),
      },
    });
  };

  const showErrorToast = () => {
    toast.error("Login Required", {
      description: "Please log in to add items to your wishlist",
      action: {
        label: "Log In",
        onClick: () => console.log("Log in clicked"),
      },
    });
  };

  const showWarningToast = () => {
    toast.warning("Stock running low", {
      description: "Only 2 items left in stock. Order soon!",
    });
  };

  const showInfoToast = () => {
    toast.info("Already in cart", {
      description: "This item is already in your cart",
      action: {
        label: "View Cart",
        onClick: () => console.log("View cart clicked"),
      },
    });
  };

  const showLoadingToast = () => {
    const id = toast.loading("Processing payment...", {
      description: "Please wait while we process your order",
    });

    // Simulate async operation
    setTimeout(() => {
      toast.success("Payment successful!", {
        id, // Replace the loading toast
        description: "Your order has been confirmed",
      });
    }, 3000);
  };

  const showPromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve("Success!") : reject("Failed!");
      }, 2000);
    });

    toast.promise(promise, {
      loading: "Saving profile...",
      success: "Profile updated successfully!",
      error: "Failed to update profile",
    });
  };

  const showWithActions = () => {
    toast("Delete item?", {
      description: "This action cannot be undone",
      action: {
        label: "Delete",
        onClick: () => toast.success("Item deleted"),
      },
      cancel: {
        label: "Cancel",
        onClick: () => console.log("Cancelled"),
      },
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🎨 Toast Preview</CardTitle>
        <CardDescription>
          Test all the custom toast variants that match your website theme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={showSuccessToast}
            variant="outline"
            className="w-full justify-start"
          >
            <span className="mr-2">🌸</span>
            Success Toast
          </Button>

          <Button
            onClick={showErrorToast}
            variant="outline"
            className="w-full justify-start"
          >
            <span className="mr-2">🧡</span>
            Error Toast
          </Button>

          <Button
            onClick={showWarningToast}
            variant="outline"
            className="w-full justify-start"
          >
            <span className="mr-2">🍑</span>
            Warning Toast
          </Button>

          <Button
            onClick={showInfoToast}
            variant="outline"
            className="w-full justify-start"
          >
            <span className="mr-2">💜</span>
            Info Toast
          </Button>

          <Button
            onClick={showLoadingToast}
            variant="outline"
            className="w-full justify-start"
          >
            <span className="mr-2">🌼</span>
            Loading Toast
          </Button>

          <Button
            onClick={showPromiseToast}
            variant="outline"
            className="w-full justify-start"
          >
            <span className="mr-2">⚡</span>
            Promise Toast
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={showWithActions}
            variant="default"
            className="w-full"
          >
            Show Toast with Action & Cancel
          </Button>
        </div>

        <div className="pt-4 border-t text-sm text-muted-foreground space-y-2">
          <p><strong>Color Guide:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>🌸 Success: Soft rose/pink gradient</li>
            <li>🧡 Error: Soft coral gradient</li>
            <li>🍑 Warning: Soft peach gradient</li>
            <li>💜 Info: Soft lavender gradient</li>
            <li>🌼 Loading: Soft cream gradient</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
