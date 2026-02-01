import Navbar from "@/components/navbar/navbar";
import NavbarSkeleton from "@/components/navbar/navbar-skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "SignIn Or SignUp - The Nala Armoire",
    description: "Authenticate to access your account or create a new one.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="w-full relative h-screen flex flex-col">
            <Suspense fallback={<NavbarSkeleton />}>
                <Navbar />
            </Suspense>
            {children}
        </main>
    );
}
