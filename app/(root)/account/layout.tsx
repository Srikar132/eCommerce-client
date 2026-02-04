import { Suspense } from "react";
import AccountSidebarWrapper from "@/components/account/account-sidebar-wrapper";
import Header from "@/components/header";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";


export default function AccountLayout({ children }: {
    children: React.ReactNode
}) {

    return (
        <div className="min-h-screen bg-background">
            <Header
                title="My Account"
                subtitle="Welcome back!"
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Sidebar - sticky on desktop */}
                    <aside className="w-full lg:w-64 lg:sticky lg:top-6 shrink-0 lg:self-start">
                        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                            <AccountSidebarWrapper />
                        </Suspense>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 w-full">
                        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                            {children}
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}