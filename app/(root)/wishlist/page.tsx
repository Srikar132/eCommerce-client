import { Metadata } from "next";
import { WishlistClient } from "@/components/wishlist/wishlist-client";
import { auth } from "@/auth";
import { LoginRequired } from "@/components/auth/login-required";

export const metadata: Metadata = {
  title: "My Wishlist | Armoire",
  description: "View and manage your saved favorite items",
};

export default async function WishlistPage() {

  const session = await auth();

  if (!session) {
    return <LoginRequired/>;
  }

  return <WishlistClient />;
}
