"use client";
import { useSyncExternalStore } from "react";
import { useCartCount } from "@/lib/tanstack/queries/cart.queries";
import { Button } from "../ui/button";
import { ShoppingBagIcon } from "lucide-react";

// Hydration-safe mount detection
const emptySubscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useHasMounted() {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}

const CartButton = ({ enabled }: { enabled: boolean }) => {
  const totalItems = useCartCount({ enabled });
  const mounted = useHasMounted();

  return (
    <Button
      className="relative  rounded-full transition-colors border-0 bg-transparent hover:bg-transparent cursor-pointer"
      aria-label="Shopping cart"

    >
      <ShoppingBagIcon
        className="w-5 h-5 lg:w-7 lg:h-7 text-foreground"
        strokeWidth={3}
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

export default CartButton;
