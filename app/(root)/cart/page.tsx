import { CartClient } from "@/components/cart/cart-client";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shopping Cart | NaLa Armoire",
  description: "Review and manage items in your shopping cart",

};

export default function Cart() {
  return (
    <>
      <Suspense fallback={<PageLoadingSkeleton/>}>
        <CartClient />
      </Suspense>
    </>
  );
}
