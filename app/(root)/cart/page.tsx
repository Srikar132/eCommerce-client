import { auth } from "@/auth";
import { LoginRequired } from "@/components/auth/login-required";
import { CartClient } from "@/components/cart/cart-client";
import { Metadata } from "next";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";

export const metadata: Metadata = {
  title: "Shopping Cart | NaLa Armoire",
  description: "Review and manage items in your shopping cart",
};

export default async function Cart() {
  const session = await auth();

  if (!session) {
    return <LoginRequired />;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="mb-8">
            <BreadcrumbNavigation />
        </div>
        <CartClient />
    </div>
  );
}
