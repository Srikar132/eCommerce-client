// app/layout.tsx
import { cookies } from "next/headers";

import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import EmailVerificationBanner from "@/components/auth/email-verification-banner";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth-provider";
import { PrefetchProvider } from "@/providers/prefetch-provider";

import { getServerAuth } from "@/lib/auth/server";
import { isTokenExpired } from "@/lib/auth/utils";

import { Toaster } from "sonner";
import Footer from "@/components/footer";
import { CartSyncProvider } from "@/providers/cart-provider";


export const metadata = {
  title: "The Nala Armoire - Discover Your Style",
  description: "Where beauty roars in every stitch. Shop the latest fashion trends.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ---------------- AUTH (SERVER) ---------------- */
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let auth = await getServerAuth();

  if (
    !auth.isAuthenticated &&
    refreshToken &&
    !isTokenExpired(refreshToken)
  ) {
    auth = { user: null, isAuthenticated: false };
  }

  console.log('[Layout] Initial User:', auth.user);

  return (
    <PrefetchProvider>
      <AuthProvider initialUser={auth.user}>
        <CartSyncProvider>
          <SidebarProvider defaultOpen={false}>
            <div className="font-sans w-full no-scrollbar">
              <AppSidebar />

              <header id="header">
                <Navbar />
                <EmailVerificationBanner className="mx-4 mb-4" />
              </header>

              <main className="w-full relative">{children}</main>

              <Footer />
              <Toaster position="top-right" className="z-50" />
            </div>
          </SidebarProvider>
        </CartSyncProvider>
      </AuthProvider>
    </PrefetchProvider>
  );
}
