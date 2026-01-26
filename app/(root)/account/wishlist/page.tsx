import { Suspense } from "react";
import { Metadata } from "next";
import WishlistClient from "./wishlist-client";
import { WishlistPageSkeleton } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "My Wishlist | Armoire",
  description: "View and manage your saved favorite items",
};

// Revalidate wishlist page every 60 seconds

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistPageSkeleton />}>
      <WishlistClient />
    </Suspense>
  );
}
