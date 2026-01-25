// app/layout.tsx
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { CartSyncProvider } from "@/providers/cart-provider";
import TanstackProvider from "@/providers/tanstack";
import { getCategoryTreeServer } from "@/lib/api/category";
import { FALLBACK_CATEGORY_TREE } from "@/lib/constants/fallback-data";
import { Suspense } from "react";

export const metadata = {
  title: "The Nala Armoire - Discover Your Style",
  description: "Where beauty roars in every stitch. Shop the latest fashion trends.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <TanstackProvider>
          <CartSyncProvider>
            <SidebarProvider defaultOpen={false}>
              <div className="font-sans w-full no-scrollbar">
                <AppSidebar />

                <header id="header">
                  {/* ✅ Wrap in Suspense to prevent blocking */}
                  <Suspense fallback={<div className="h-16 bg-background" />}>
                    <NavbarWithData />
                  </Suspense>
                </header>

                <main className="w-full relative">{children}</main>

                <Footer />
                <Toaster 
                  position="top-right" 
                  expand={false}
                  richColors={false}
                  closeButton
                  duration={4000}
                />
              </div>
            </SidebarProvider>
          </CartSyncProvider>
      </TanstackProvider>
  );
}

// Separate async component for navbar data fetching
async function NavbarWithData() {
  let categoryTree = FALLBACK_CATEGORY_TREE;
  
  try {
    categoryTree = await getCategoryTreeServer();
  } catch (error) {
    console.error("Failed to fetch category tree:", error);
    // Falls back to static data
  }

  return <Navbar categoryTree={categoryTree} />;
}
