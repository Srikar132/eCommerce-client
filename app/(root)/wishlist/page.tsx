import { Suspense } from "react";
import { Metadata } from "next";
import { WishlistPageSkeleton } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "My Wishlist | Armoire",
  description: "View and manage your saved favorite items",
};


export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistPageSkeleton />}>
      {/* <WishlistClient /> */}
    </Suspense>
  );
}
