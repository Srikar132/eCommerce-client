import AppSidebar from "@/components/app-sidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import TanstackProvider from "@/providers/tanstack";




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TanstackProvider>
        <SidebarProvider 
          defaultOpen={false}          
        >
          <div className="font-sans w-full  no-scrollbar">
            <AppSidebar />
            
            <header id="header">
              <Navbar />
            </header>

            <main className="w-full relative">
              {children}
            </main>

            <footer className="">
              <Footer />
            </footer>
          </div>
        </SidebarProvider>
      </TanstackProvider>
    </>
  );
}
