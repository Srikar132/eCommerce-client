import { useCartManager } from "@/hooks/use-cart";
import { Button } from "../ui/button";
import Image from "next/image";

const CartButton = () => {
  const { itemCount } = useCartManager();

  return (
    <Button
      className="nav-btn relative p-1.5 sm:p-2"
      aria-label="Shopping cart"
      suppressHydrationWarning
    >
      <Image
        src="/icons/cart.svg"
        alt="cart"
        height={18}
        width={18}
        className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
      />

      {itemCount > 0 && (
        <span
          className="
            absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1
            min-w-3.5 h-3.5 sm:min-w-4 sm:h-4
            px-0.5 sm:px-1
            rounded-full
            bg-red-600 text-white
            text-[9px] sm:text-[10px] lg:text-[11px] font-semibold
            flex items-center justify-center
            leading-none
          "
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
