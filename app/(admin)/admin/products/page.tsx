"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { DataTable } from "@/components/admin/data-table";
import { BulkActions } from "@/components/admin/bulk-actions";
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
import { useInfiniteProducts, useFlatProducts, useProductCount } from "@/lib/tanstack/queries/product.queries";
import { buildProductParams } from "@/lib/searchparams";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

// Enhanced DataTable wrapper with bulk actions
function EnhancedDataTable({
    products,
    totalPages,
    isLoading,
    isFetching
}: {
    products: Product[];
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
}) {
    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

    const clearSelection = () => {
        setSelectedRowIds([]);
        // Clear the table selection - this would need to be passed to DataTable
    };

    return (
        <div className="space-y-4">
            <BulkActions
                selectedRowIds={selectedRowIds}
                onClearSelection={clearSelection}
            />
            <DataTable
                columns={columns}
                data={products || []}
                pageCount={totalPages || 0}
                isLoading={isLoading}
                isFetching={isFetching}
            />
        </div>
    );
}

// Products content component
function ProductsContent() {
    const searchParams = useSearchParams();
    const params = buildProductParams(searchParams);

    const infiniteQuery = useInfiniteProducts(params);
    const products = useFlatProducts(infiniteQuery.data);
    const totalCount = useProductCount(infiniteQuery.data);

    // Calculate total pages from totalCount
    const totalPages = Math.ceil(totalCount / (params.limit || 20));

    console.log('Products data:', {
        products,
        params,
        dataLength: products?.length,
        totalElements: totalCount,
        totalPages,
        isLoading: infiniteQuery.isLoading,
        isFetching: infiniteQuery.isFetching
    });

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="admin-page-title">Product Management</h1>
                    <p className="admin-page-description">
                        Manage your store&apos;s products, variants, and inventory
                    </p>
                </div>

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Products</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2">
                    <Link href="/admin/products/create">
                        <Button className="admin-primary-button">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Product
                        </Button>
                    </Link>
                </div>

                <SearchForm
                    action="/admin/products"
                    search={params.searchQuery}
                    page={params.page}
                    size={params.limit}
                />
            </div>

            <EnhancedDataTable
                products={products}
                totalPages={totalPages}
                isLoading={infiniteQuery.isLoading}
                isFetching={infiniteQuery.isFetching}
            />
        </div>
    );
}

// Main products page with suspense boundary
export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-sm uppercase font-bold">Product LIST</h1>
                        </div>
                    </div>
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                            <span>Loading products...</span>
                        </div>
                    </div>
                </div>
            }
        >
            <ProductsContent />
        </Suspense>
    );
}
