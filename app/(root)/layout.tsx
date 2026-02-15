// app/layout.tsx
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import NavbarSkeleton from "@/components/navbar/navbar-skeleton";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { ShoppingCart } from "lucide-react";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import { LoginDrawerProvider } from "@/components/ui/login-drawer";
import { AdminStoreBanner } from "@/components/admin-store-banner";
import { auth } from "@/auth";
import { OrganizationSchema, WebsiteSchema } from "@/components/shared/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Where beauty roars in every stitch. Discover premium customizable fashion at Nala Armoire - ethnic wear, contemporary styles, and personalized clothing handcrafted with love.",
  openGraph: {
    title: "Nala Armoire - Premium Customizable Fashion",
    description: "Where beauty roars in every stitch. Discover premium customizable fashion at Nala Armoire.",
    url: "https://nalaarmoire.com",
    images: ["/images/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userRole = session?.user?.role;

  return (
    <main className="w-full">
      <AdminStoreBanner userRole={userRole} />

      <div className="sticky top-0 z-50 w-full bg-primary text-primary-foreground text-xs flex items-center justify-center py-1 tracking-wider">
        <ShoppingCart className="mr-2" size={13} />
        PREPAID ORDERS ONLY!
      </div>


      <div className="w-full">
        <AppSidebar />

        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>

        <main className="w-full relative">
          <Suspense fallback={<PageLoadingSkeleton />}>
            {children}
          </Suspense>
        </main>

        <Footer />
      </div>

      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebsiteSchema />

      <LoginDrawerProvider />
    </main>
  );
}