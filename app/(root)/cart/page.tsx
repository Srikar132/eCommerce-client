import { Suspense } from "react";
import { Metadata } from "next";
import CartClient from "./cart-client";
import { CartPageSkeleton } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "Shopping Cart | Armoire",
  description: "Review and manage items in your shopping cart",
};

// Revalidate cart page every 60 seconds
// export const revalidate = 60;

export default function CartPage() {
  return (
    <Suspense fallback={<CartPageSkeleton />}>
      <CartClient />
    </Suspense>
  );
}
