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
import { useInfiniteOrders, useFlatOrders, useOrderCount } from "@/lib/tanstack/queries/order.queries";
import { buildOrderParams } from "@/lib/searchparams";
import { ShoppingBag, Filter } from "lucide-react";
import { columns } from "./columns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

import { OrderWithUser } from "@/types/orders";

// Orders content component
function OrdersContent() {
    const searchParams = useSearchParams();
    const params = buildOrderParams(searchParams);
    const router = useRouter();

    const infiniteQuery = useInfiniteOrders(params);
    const orders = useFlatOrders(infiniteQuery.data);
    const totalCount = useOrderCount(infiniteQuery.data);

    // Calculate total pages from totalCount
    const totalPages = Math.ceil(totalCount / (params.limit || 20));

    const handleRowClick = (order: OrderWithUser) => {
        router.push(`/admin/orders/${order.id}`);
    };

    const handleStatusFilter = (status: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (status === "all") {
            newParams.delete("status");
        } else {
            newParams.set("status", status);
        }
        newParams.set("page", "0");
        router.push(`/admin/orders?${newParams.toString()}`);
    };

    const handlePaymentStatusFilter = (paymentStatus: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (paymentStatus === "all") {
            newParams.delete("paymentStatus");
        } else {
            newParams.set("paymentStatus", paymentStatus);
        }
        newParams.set("page", "0");
        router.push(`/admin/orders?${newParams.toString()}`);
    };

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    <h1 className="text-sm uppercase font-bold">Order Management</h1>
                </div>

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>All Orders</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">


                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <Select value={params.status || "all"} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="RETURNED">Returned</SelectItem>
                                <SelectItem value="REFUNDED">Refunded</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={params.paymentStatus || "all"} onValueChange={handlePaymentStatusFilter}>
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="Payment Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payments</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="REFUNDED">Refunded</SelectItem>
                                <SelectItem value="PARTIALLY_REFUNDED">Partially Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <SearchForm
                    action="/admin/orders"
                    search={params.searchQuery}
                    page={params.page}
                    size={params.limit}
                    placeholder="Search by order number, customer name, email..."
                />
            </div>

            <DataTable
                columns={columns}
                data={orders || []}
                pageCount={totalPages || 0}
                isLoading={infiniteQuery.isLoading}
                isFetching={infiniteQuery.isFetching}
                onRowClick={handleRowClick}
            />
        </div>
    );
}

// Main orders page with suspense boundary
export default function OrdersPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            <h1 className="text-sm uppercase font-bold">Order Management</h1>
                        </div>
                    </div>
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                            <span>Loading orders...</span>
                        </div>
                    </div>
                </div>
            }
        >
            <OrdersContent />
        </Suspense>
    );
}
