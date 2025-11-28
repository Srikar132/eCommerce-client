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
          <div className="font-sans w-full overflow-x-hidden no-scrollbar">
            <AppSidebar />
            
            <header className="header">
              <Navbar />
            </header>

            <main className="w-full overflow-x-hidden">
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
