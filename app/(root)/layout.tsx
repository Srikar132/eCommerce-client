// app/layout.tsx
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/Footer";
import { LoginDrawerProvider } from "@/components/ui/login-drawer";
import { auth } from "@/auth";
import { OrganizationSchema, WebsiteSchema } from "@/components/shared/structured-data";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userRole = session?.user?.role;

  return (
    <main className="w-full">

      {/* <div className="top-0 z-50 w-full  text-xs flex items-center justify-center py-1 tracking-wider">
        <ShoppingCart className="mr-2" size={13} />
        PREPAID ORDERS ONLY!
      </div> */}


      <div className="w-full">
        <AppSidebar />

          <Navbar />

        <main className="w-full relative">
            {children}
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