import AccountSidebarWrapper from "@/components/account/account-sidebar-wrapper";
import Header from "@/components/header";
import { getServerAuth } from "@/lib/auth/server";


export default async function AccountLayout({ children }: {
    children: React.ReactNode
}) {

    const auth = await getServerAuth();
    const user = auth.user;

    return (
        <div className="min-h-screen bg-background">
            <Header
                title="My Account"
                subtitle={`Welcome back, ${user?.email}`}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Sidebar - sticky on desktop */}
                    <aside className="w-full lg:w-64 lg:sticky lg:top-6 shrink-0 lg:self-start">
                        <AccountSidebarWrapper />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 w-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}