"use client";

import { useWishlistCount } from "@/lib/tanstack/queries/wishlist.queries";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";

// Hydration-safe mount detection
const emptySubscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useHasMounted() {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}

const WishlistButton = ({ enabled }: { enabled: boolean }) => {
  const totalItems = useWishlistCount({ enabled });
  const mounted = useHasMounted();

  return (
    <Button
      className="relative p-1 hover:bg-primary/50 rounded-full transition-colors border-0 bg-transparent"
      aria-label="Wishlist"
    >
      <Heart
        className="w-5 h-5 text-foreground"
        strokeWidth={2}
      // fill="#402e27"
      // stroke="#402e27"
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
