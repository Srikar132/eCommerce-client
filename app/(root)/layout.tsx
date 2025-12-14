import AppSidebar from "@/components/app-sidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EmailVerificationBanner from "@/components/auth/email-verification-banner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerAuth } from "@/lib/auth/server";
import { AuthProvider } from "@/providers/auth-provider";
import TanstackProvider from "@/providers/tanstack";
import { Toaster } from "sonner";




export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const auth = await getServerAuth();


  return (
    <>
      <TanstackProvider>
        <AuthProvider initialUser={auth.user}>
        <SidebarProvider 
          defaultOpen={false}          
        >
          <div className="font-sans w-full  no-scrollbar">
            <AppSidebar />
            
            <header id="header">
              <Navbar />
              <EmailVerificationBanner className="mx-4 mb-4" />
            </header>

            <main className="w-full relative">
              {children}
            </main>

            <footer className="">
              <Footer />
            </footer>

            <Toaster position="top-right" className="z-50" />
          </div>
        </SidebarProvider>
        </AuthProvider>
      </TanstackProvider>
    </>
  );
}
