// app/layout.tsx
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";

import { SidebarProvider } from "@/components/ui/sidebar";
import { PrefetchProvider } from "@/providers/prefetch-provider";


import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { CartSyncProvider } from "@/providers/cart-provider";
import { User } from "@/types";


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
    <PrefetchProvider>
        <CartSyncProvider>
          <SidebarProvider defaultOpen={false}>
            <div className="font-sans w-full no-scrollbar">
              <AppSidebar />

              <header id="header">
                <Navbar />
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
    </PrefetchProvider>
  );
}
