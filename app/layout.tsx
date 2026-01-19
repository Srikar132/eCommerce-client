import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/providers/tanstack";
import Script from "next/script";



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
    default: "THE NALA ARMOIRE — Bold Streetwear Fashion",
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
        <TanstackProvider>
          {children}
        </TanstackProvider>

        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
