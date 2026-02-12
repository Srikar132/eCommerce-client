"use client";

import { OrderWithUser, OrderStatus } from "@/types/orders";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit2, Package } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Order Actions component
function OrderActions({ order }: { order: OrderWithUser }) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(order.orderNumber)}
                >
                    Copy order number
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(order.id)}
                >
                    Copy order ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<OrderWithUser>[] = [
    {
        accessorKey: "orderNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Order Number
                    <svg
                        className={`ml-2 h-4 w-4 transition-transform ${column.getIsSorted() === "asc"
                                ? "rotate-0"
                                : column.getIsSorted() === "desc"
                                    ? "rotate-180"
                                    : "opacity-50"
                            }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 14l5-5 5 5" />
                    </svg>
                </Button>
            );
        },
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="font-medium">
                    {order.orderNumber}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Status
                    <svg
                        className={`ml-2 h-4 w-4 transition-transform ${column.getIsSorted() === "asc"
                                ? "rotate-0"
                                : column.getIsSorted() === "desc"
                                    ? "rotate-180"
                                    : "opacity-50"
                            }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 14l5-5 5 5" />
                    </svg>
                </Button>
            );
        },
        cell: ({ row }) => {
            const order = row.original;
            const getStatusVariant = (status: OrderStatus) => {
                switch (status) {
                    case "PENDING":
                        return "secondary";
                    case "CONFIRMED":
                        return "default";
                    case "PROCESSING":
                        return "outline";
                    case "SHIPPED":
                        return "secondary";
                    case "DELIVERED":
                        return "default";
                    case "CANCELLED":
                        return "destructive";
                    case "RETURNED":
                        return "outline";
                    case "REFUNDED":
                        return "secondary";
                    default:
                        return "secondary";
                }
            };

            return (
                <Badge variant={getStatusVariant(order.status as OrderStatus)}>
                    {order.status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "paymentStatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Payment Status
                    <svg
                        className={`ml-2 h-4 w-4 transition-transform ${column.getIsSorted() === "asc"
                                ? "rotate-0"
                                : column.getIsSorted() === "desc"
                                    ? "rotate-180"
                                    : "opacity-50"
                            }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 14l5-5 5 5" />
                    </svg>
                </Button>
            );
        },
        cell: ({ row }) => {
            const order = row.original;
            const getPaymentStatusVariant = (status: string) => {
                switch (status) {
                    case "PENDING":
                        return "secondary";
                    case "PROCESSING":
                        return "outline";
                    case "PAID":
                        return "default";
                    case "FAILED":
                        return "destructive";
                    case "REFUNDED":
                        return "outline";
                    case "PARTIALLY_REFUNDED":
                        return "secondary";
                    default:
                        return "secondary";
                }
            };

            return (
                <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                    {order.paymentStatus}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Created At
                    <svg
                        className={`ml-2 h-4 w-4 transition-transform ${column.getIsSorted() === "asc"
                                ? "rotate-0"
                                : column.getIsSorted() === "desc"
                                    ? "rotate-180"
                                    : "opacity-50"
                            }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 14l5-5 5 5" />
                    </svg>
                </Button>
            );
        },
        cell: ({ row }) => {
            const order = row.original;
            const date = new Date(order.createdAt);
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{date.toLocaleDateString()}</span>
                    <span className="text-sm text-muted-foreground">{date.toLocaleTimeString()}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "totalAmount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Total Amount
                    <svg
                        className={`ml-2 h-4 w-4 transition-transform ${column.getIsSorted() === "asc"
                                ? "rotate-0"
                                : column.getIsSorted() === "desc"
                                    ? "rotate-180"
                                    : "opacity-50"
                            }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 14l5-5 5 5" />
                    </svg>
                </Button>
            );
        },
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="font-medium">
                    ₹{order.totalAmount.toLocaleString()}
                </div>
            );
        },
    },
    {
        accessorKey: "userName",
        header: "Customer",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{order.userName || 'Unknown'}</span>
                    {order.userEmail && (
                        <span className="text-sm text-muted-foreground">{order.userEmail}</span>
                    )}
                    {order.userPhone && (
                        <span className="text-sm text-muted-foreground">{order.userPhone}</span>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const order = row.original;
            return <OrderActions order={order} />;
        },
    },
];
