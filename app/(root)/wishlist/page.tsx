import { Suspense } from "react";
import { Metadata } from "next";
import { WishlistPageSkeleton } from "@/components/ui/skeletons";
import { WishlistClient } from "@/components/wishlist/wishlist-client";

export const metadata: Metadata = {
  title: "My Wishlist | Armoire",
  description: "View and manage your saved favorite items",
};

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistPageSkeleton />}>
      <WishlistClient />
    </Suspense>
  );
}
