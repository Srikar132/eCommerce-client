// app/layout.tsx
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import NavbarSkeleton from "@/components/navbar/navbar-skeleton";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { CartSyncProvider } from "@/providers/cart-provider";
import TanstackProvider from "@/providers/tanstack";
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
                  <Suspense fallback={<NavbarSkeleton />}>
                    <Navbar />
                  </Suspense>
                </header>

                <Suspense fallback={<></>}>
                  <BreadcrumbNavigation />
                </Suspense>

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

