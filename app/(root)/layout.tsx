// app/layout.tsx
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import NavbarSkeleton from "@/components/navbar/navbar-skeleton";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { ShoppingCart } from "lucide-react";

export const metadata = {
  title: "Nala Armoire - Discover Your Style",
  description: "Where beauty roars in every stitch. Shop the latest fashion trends.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <div className="w-full bg-primary text-primary-foreground text-xs flex items-center justify-center py-1 tracking-wider">
        <ShoppingCart className="mr-2" size={13} />
        PREPAID ORDERS ONLY!
      </div>


      <div className="w-full">
        <AppSidebar />

        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>

        <main className="w-full relative">{children}</main>

        <Footer />

      </div>
    </main>
  );
}