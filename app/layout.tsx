import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/providers/tanstack";
import Script from "next/script";
import { SidebarProvider } from "@/components/ui/sidebar";
import NextTopLoader from "nextjs-toploader";
import AuthProvider from "@/providers/auth-provider";
import { Suspense } from "react";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import { Toaster } from "@/components/ui/sonner";



const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",      // headlines
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",         // body + UI
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "NALA ARMOIRE — Bold Streetwear Fashion",
    template: "%s",
  },
  description:
    "Discover premium streetwear clothing with bold fits and modern aesthetic. Designed for everyday attitude and urban lifestyle.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {/* Page Loading Progress Bar */}
        <NextTopLoader
          color="#ff909a"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />

        <Suspense fallback={<PageLoadingSkeleton />}>
          <AuthProvider>
            <TanstackProvider>
              <SidebarProvider defaultOpen={false}>
                {children}
              </SidebarProvider>
            </TanstackProvider>
          </AuthProvider>


          <Toaster
            position="top-right"
            expand={false}
            richColors={false}
            closeButton
            duration={4000}
          />
        </Suspense>

        {/* Load Razorpay globally for payment gateway */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          onLoad={() => {
            console.log('Razorpay SDK loaded successfully');
          }}
          onError={(e) => {
            console.error('Failed to load Razorpay SDK:', e);
          }}
        />
      </body>
    </html>
  );
}
