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
import { Button } from "@/components/ui/button";
import { useInfiniteUsers, useFlatUsers, useUserCount } from "@/lib/tanstack/queries/user.queries";
import { buildUserParams } from "@/lib/searchparams";
import { Users, Plus } from "lucide-react";
import Link from "next/link";
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

    console.log('Users data:', {
        users,
        params,
        dataLength: users?.length,
        totalElements: totalCount,
        totalPages,
        isLoading: infiniteQuery.isLoading,
        isFetching: infiniteQuery.isFetching
    });

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <h1 className="text-sm uppercase font-bold">User Management</h1>
                </div>

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>All Users</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <SearchForm
                    action="/admin/users"
                    search={params.searchQuery}
                    page={params.page}
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
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <h1 className="text-sm uppercase font-bold">User Management</h1>
                        </div>
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
