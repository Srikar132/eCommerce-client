import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import "./globals.css";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",         // body + UI
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",      // headlines
  display: "swap",
});

export const metadata : Metadata = {
  title: {
    default: "THE NALA ARMOIRE — Bold Streetwear Fashion",
    template: "%s | THE NALA ARMOIRE",
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
      <body className={`${montserrat.variable} ${oswald.variable} antialiased`}>
          {children}
      </body>
    </html>
  );
}
