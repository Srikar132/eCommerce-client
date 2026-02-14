"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Product, ProductVariant } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/admin/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, Package, Copy, DollarSign } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils/format";
import { useDeleteProduct } from "@/hooks/use-product-mutations";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

// Status badge component
const StatusBadge = ({ isActive, isDraft }: { isActive: boolean; isDraft?: boolean }) => {
    if (isDraft) {
        return (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                Draft
            </Badge>
        );
    }

    return (
        <Badge
            variant={isActive ? "default" : "secondary"}
            className={isActive
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }
        >
            {isActive ? "Active" : "Inactive"}
        </Badge>
    );
};

// Product row actions component
const ProductRowActions = ({ product }: { product: Product }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const deleteProductMutation = useDeleteProduct();

    const handleCopyId = () => {
        navigator.clipboard.writeText(product.id);
        toast.success("Product ID copied to clipboard");
    };

    const handleCopySlug = () => {
        navigator.clipboard.writeText(product.slug);
        toast.success("Product slug copied to clipboard");
    };

    const handleDelete = async () => {
        deleteProductMutation.mutate(product.id, {
            onSuccess: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    return (
        <>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 admin-glow-button"
                    asChild
                >
                    <Link href={`/products/${product.slug}`} target="_blank">
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">View product</span>
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 admin-glow-button"
                    asChild
                >
                    <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Edit product</span>
                    </Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 admin-glow-button">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="admin-card">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={handleCopyId}
                            className="admin-glow-button cursor-pointer"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy product ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleCopySlug}
                            className="admin-glow-button cursor-pointer"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy slug
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive admin-glow-button cursor-pointer"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={deleteProductMutation.isPending}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete product
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="admin-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone and will remove all associated variants and images.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteProductMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteProductMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const columns: ColumnDef<Product>[] = [
    // Row Selection
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="admin-glow-button"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="admin-glow-button"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    // Product Image + Name + Info
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Product" />
        ),
        cell: ({ row }) => {
            const product = row.original;
            const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

            return (
                <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">
                        {primaryImage?.imageUrl ? (
                            <Image
                                src={primaryImage.imageUrl}
                                alt={primaryImage.altText || product.name}
                                className="h-12 w-12 rounded-lg object-cover bg-accent admin-card ring-1 ring-border"
                                width={48}
                                height={48}
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center admin-card ring-1 ring-border">
                                <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-base truncate">{product.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs font-mono">
                                {product.sku}
                            </Badge>
                            {product.isDraft && (
                                <Badge variant="secondary" className="text-xs">
                                    Draft
                                </Badge>
                            )}
                            {!product.isActive && (
                                <Badge variant="destructive" className="text-xs">
                                    Inactive
                                </Badge>
                            )}
                        </div>
                        {product.description && (
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-75">
                                {product.description.substring(0, 80)}
                                {product.description.length > 80 && "..."}
                            </div>
                        )}
                    </div>
                </div>
            );
        },
    },

    // Base Price with formatting
    {
        accessorKey: "basePrice",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
            const price = row.original.basePrice;
            return (
                <div className="flex items-center font-semibold text-lg">
                    <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                    {formatCurrency(price)}
                </div>
            );
        },
    },

    // Variants Count
    {
        id: "variants",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Variants" />
        ),
        cell: ({ row }) => {
            const variantCount = row.original.variants?.length || 0;
            return (
                <div className="text-center">
                    <Badge variant="secondary" className="font-mono">
                        {variantCount}
                    </Badge>
                </div>
            );
        },
        enableSorting: false,
    },

    // Total Stock
    {
        id: "stock",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Stock" />
        ),
        cell: ({ row }) => {
            const totalStock = row.original.variants?.reduce((sum: number, variant: ProductVariant) => sum + variant.stockQuantity, 0) || 0;

            return (
                <div className="text-center">
                    <Badge
                        variant={totalStock < 10 ? "secondary" : "default"}
                        className="font-mono"
                    >
                        {totalStock}
                    </Badge>
                </div>
            );
        },
        enableSorting: false,
    },

    // Status (Active/Inactive/Draft)
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Status"
                filterOptions={[
                    { label: "Active", value: "true", paramKey: "isActive" },
                    { label: "Inactive", value: "false", paramKey: "isActive" },
                    { label: "Draft", value: "true", paramKey: "isDraft" },
                ]}
            />
        ),
        cell: ({ row }) => {
            const { isActive, isDraft } = row.original;
            return <StatusBadge isActive={isActive} isDraft={isDraft} />;
        },
        enableSorting: false,
    },

    // Created Date with better formatting
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>
                    <div className="text-muted-foreground">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            );
        },
    },

    // Actions with enhanced functionality
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original;
            return <ProductRowActions product={product} />;
        },
        enableSorting: false,
        enableHiding: false,
    },
];
