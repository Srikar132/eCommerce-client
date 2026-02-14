import Navbar from "@/components/navbar/navbar";
import NavbarSkeleton from "@/components/navbar/navbar-skeleton";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "twilio/lib/base/Page";

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
            <Suspense fallback={<PageLoadingSkeleton />}>
                {children}
            </Suspense>
        </main>
    );
}
