import Link from "next/link";
import { ShieldCheck, ChevronLeft } from "lucide-react";
import { CartProvider } from "@/context/cart-context";

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] container max-w-[75%] mx-auto flex flex-col font-sans">
            <CartProvider>
                {/* ── MINIMALIST CHECKOUT HEADER ── */}
                <header className="bg-white border-b border-foreground/5 sticky top-0 z-50">
                    <div className="h-20 px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
                        {/* Back to Shop */}
                        <Link
                            href="/products"
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                            <span className="hidden sm:inline">Back to shop</span>
                        </Link>

                        {/* Logo */}
                        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 group">
                            <p className="text-xl md:text-2xl font-bold uppercase text-foreground tracking-tighter">
                                <span className="font-cursive! lowercase text-2xl md:text-3xl">Nala</span> Armoire
                            </p>
                        </Link>

                        {/* Secure Badge */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Support</span>
                                <span className="text-xs font-medium text-foreground lowercase">support@nalaarmoire.com</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full">
                                <ShieldCheck size={14} className="text-[#5FB281]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">Secure</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 pb-8 md:pb-16">
                    <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                        {children}
                    </div>
                </main>

                {/* ── REFINED CHECKOUT FOOTER ── */}
                <footer className="border-t border-foreground/5 py-12 bg-white">
                    <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                            {/* Trust Info */}
                            <div className="flex flex-col items-center md:items-start gap-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                    Powered by Razorpay Secure
                                </p>
                                <p className="text-[10px] font-medium text-muted-foreground/60">
                                    © {new Date().getFullYear()} Nala Armoire. All rights reserved.
                                </p>
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <Link href="/terms" className="hover:text-foreground transition-colors underline-offset-8 hover:underline">Terms</Link>
                                <Link href="/privacy" className="hover:text-foreground transition-colors underline-offset-8 hover:underline">Privacy</Link>
                                <Link href="/shipping" className="hover:text-foreground transition-colors underline-offset-8 hover:underline">Shipping</Link>
                                <Link href="/returns" className="hover:text-foreground transition-colors underline-offset-8 hover:underline">Returns</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </CartProvider>
        </div>
    );
}
