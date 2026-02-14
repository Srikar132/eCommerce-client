import { auth } from "@/auth";
import { LoginRequired } from "@/components/auth/login-required";
import { CartClient } from "@/components/cart/cart-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | NaLa Armoire",
  description: "Review and manage items in your shopping cart",
};

export default async function Cart() {
  const session = await auth();

  if (!session) {
    return <LoginRequired />;
  }

  return <CartClient />;
}
