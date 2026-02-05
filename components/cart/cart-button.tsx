import { useCart } from "@/hooks/use-cart";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";

const CartButton = () => {
  const { totalItems } = useCart();

  return (
    <Button
      className="relative p-2 hover:bg-primary/50 rounded-full transition-colors border-0 bg-transparent"
      aria-label="Shopping cart"
      suppressHydrationWarning
    >
      <ShoppingBag
        className="w-5 h-5 text-foreground"
        strokeWidth={1.5}
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
