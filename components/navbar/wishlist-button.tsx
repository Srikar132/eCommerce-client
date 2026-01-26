"use client";

import { useWishlistCount } from "@/lib/tanstack/queries/wishlist.queries";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";

const WishlistButton = () => {
  const { isAuthenticated } = useAuthStore();
  const { data: wishlistCount } = useWishlistCount(isAuthenticated);
  
  const itemCount = wishlistCount?.count ?? 0;

  return (
    <Button
      className="relative p-2 hover:bg-primary/50 rounded-full transition-colors border-0 bg-transparent"
      aria-label="Wishlist"
      suppressHydrationWarning
    >
      <Heart 
        className="w-5 h-5 text-foreground" 
        strokeWidth={1.5}
      />

      {itemCount > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            min-w-4.5 h-4.5
            px-1
            rounded-full
            bg-primary text-white
            text-[10px] font-medium
            flex items-center justify-center
            leading-none
            shadow-sm
          "
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
};

export default WishlistButton;
