import { ThemeProvider } from "@/providers/theme-provider";
import { Inter } from "next/font/google";
import "@/styles/admin.css";

// Professional sans-serif font for admin panel
const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-admin",
    display: "swap",
});

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning className="dark">
            <body className={`${inter.variable} font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

export default Layout;