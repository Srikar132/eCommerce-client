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
import type { Metadata, Viewport } from "next";

// ============================================================================
// SEO METADATA CONFIGURATION
// ============================================================================

const SITE_URL = "https://nalaarmoire.com";
const SITE_NAME = "Nala Armoire";
const SITE_DESCRIPTION = "Where beauty roars in every stitch. Discover premium customizable fashion, handcrafted with love. Shop ethnic wear, contemporary styles, and personalized clothing at Nala Armoire.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Premium Customizable Fashion`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Nala Armoire",
    "customizable fashion",
    "ethnic wear",
    "handcrafted clothing",
    "Indian fashion",
    "personalized clothing",
    "women's fashion",
    "designer wear",
    "boutique fashion",
    "custom tailoring",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Premium Customizable Fashion`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Where beauty roars in every stitch`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Premium Customizable Fashion`,
    description: SITE_DESCRIPTION,
    images: ["/images/og-image.jpg"],
    creator: "@nalaarmoire",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add your Google Search Console verification code here
    google: "google2475ce37e89fe0b0.html",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};



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
        />
      </body>
    </html>
  );
}
