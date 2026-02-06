import { useCartCount } from "@/lib/tanstack/queries/cart.queries";
import { Button } from "../ui/button";
import { ShoppingBagIcon } from "lucide-react";

const CartButton = () => {
  const totalItems = useCartCount();

  return (
    <Button
      className="relative p-1 hover:bg-primary/50 rounded-full transition-colors border-0 bg-transparent"
      aria-label="Shopping cart"
      suppressHydrationWarning
    >
      <ShoppingBagIcon
        className="w-5 h-5 text-foreground"
        strokeWidth={2}
        fill="#402e27"
        stroke="#402e27"
      />

      {totalItems > 0 && (
        <span
          suppressHydrationWarning
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
