"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const WishlistButton = () => {
  const { totalItems } = useWishlist();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      className="relative p-2 hover:bg-primary/50 rounded-full transition-colors border-0 bg-transparent"
      aria-label="Wishlist"
    >
      <Heart 
        className="w-5 h-5 text-foreground" 
        strokeWidth={1.5}
      />

      {mounted && totalItems > 0 && (
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
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  );
};

export default WishlistButton;
