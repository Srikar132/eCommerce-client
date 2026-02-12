import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import "@/styles/admin.css";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="admin-panel min-h-screen w-full">
            <SidebarProvider defaultOpen={true}>
                <div className="flex min-h-screen w-full">
                    <AdminSidebar />
                    <SidebarInset className="flex-1 w-full">
                        <AdminHeader />
                        <main className="admin-scrollbar flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 lg:p-8 w-full">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default AdminLayout;