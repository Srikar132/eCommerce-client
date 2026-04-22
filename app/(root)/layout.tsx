// app/layout.tsx
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/Footer";

// import { AdminStoreBanner } from "@/components/admin-store-banner";
import { auth } from "@/auth";
import { OrganizationSchema, WebsiteSchema } from "@/components/shared/structured-data";
import { CartProvider } from "@/context/cart-context";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { ProductOptionsProvider } from "@/context/product-options-context";
import { ProductOptionsSidebar } from "@/components/product/product-options-sidebar";
import { FloatingChat } from "@/components/chat/floating-chat";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ProductOptionsProvider>
      <CartProvider>
        <main className="w-full">

          <div className="w-full">
            <AppSidebar />

            <Navbar />

            <main className="w-full relative">
              {children}
            </main>

            <Footer />
          </div>

          {/* Floating Concierge Chat */}
          <FloatingChat />

          {/* Structured Data for SEO */}
          <OrganizationSchema />
          <WebsiteSchema />

          <CartSidebar />
          <ProductOptionsSidebar />
        </main>
      </CartProvider>
    </ProductOptionsProvider>
  );
}