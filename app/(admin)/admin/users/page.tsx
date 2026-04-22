"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/admin/data-table";
import { SearchForm } from "@/components/shared/form-search-input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useInfiniteUsers, useFlatUsers, useUserCount } from "@/lib/tanstack/queries/user.queries";
import { buildUserParams } from "@/lib/searchparams";
import { columns } from "./columns";

// Users content component
function UsersContent() {
    const searchParams = useSearchParams();
    const params = buildUserParams(searchParams);

    const infiniteQuery = useInfiniteUsers(params);
    const users = useFlatUsers(infiniteQuery.data);
    const totalCount = useUserCount(infiniteQuery.data);

    // Calculate total pages from totalCount
    const totalPages = Math.ceil(totalCount / (params.limit || 20));


    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1.5">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground/90 uppercase">
                        User Management
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Oversee your customer base, manage administrative permissions, and track user engagement across the platform.
                    </p>
                </div>

                <Breadcrumb className="hidden md:block">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin" className="text-[10px] font-black uppercase tracking-widest opacity-70">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="opacity-30" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-[10px] font-black uppercase tracking-widest text-primary">All Users</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <SearchForm
                    action="/admin/users"
                    search={params.searchQuery}
                    size={params.limit}
                    placeholder="Search users by email, phone, or name..."
                />
            </div>

            <DataTable
                columns={columns}
                data={users || []}
                pageCount={totalPages || 0}
                isLoading={infiniteQuery.isLoading}
                isFetching={infiniteQuery.isFetching}
            />
        </div>
    );
}

// Main users page with suspense boundary
export default function UsersPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="admin-page-title">User Management</h1>
                    </div>
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                            <span>Loading users...</span>
                        </div>
                    </div>
                </div>
            }
        >
            <UsersContent />
        </Suspense>
    );
}
