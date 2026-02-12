"use client";

import { UserWithStats } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteUser, useUpdateUserRole } from "@/lib/tanstack/queries/user.queries";
import { toast } from "sonner";

// User Actions component
function UserActions({ user }: { user: UserWithStats }) {
    const deleteUserMutation = useDeleteUser();
    const updateRoleMutation = useUpdateUserRole();

    const handleDeleteUser = async () => {
        if (window.confirm(`Are you sure you want to delete user "${user.name || user.email || user.phone}"? This action cannot be undone.`)) {
            try {
                await deleteUserMutation.mutateAsync(user.id);
                toast.success("User deleted", {
                    description: "User has been successfully deleted.",
                });
            } catch (error) {
                toast.error("Error", {
                    description: "Failed to delete user. Please try again.",
                });
            }
        }
    };

    const handleToggleRole = async () => {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        if (window.confirm(`Are you sure you want to change ${user.name || user.email || user.phone} to ${newRole}?`)) {
            try {
                await updateRoleMutation.mutateAsync({ userId: user.id, newRole });
                toast.success("Role updated", {
                    description: `User role has been changed to ${newRole}.`,
                });
            } catch (error) {
                toast.error("Error", {
                    description: "Failed to update user role. Please try again.",
                });
            }
        }
    };

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
                    onClick={() => navigator.clipboard.writeText(user.id)}
                >
                    Copy user ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToggleRole}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Make {user.role === 'ADMIN' ? 'User' : 'Admin'}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDeleteUser}
                    className="text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete user
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<UserWithStats>[] = [
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Email
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
            const user = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{user.email || 'Not provided'}</span>
                    {user.name && <span className="text-sm text-muted-foreground">{user.name}</span>}
                </div>
            );
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Phone
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
            const user = row.original;
            return (
                <div className="flex items-center gap-2">
                    <span>{user.phone}</span>
                    {user.phoneVerified && (
                        <Badge variant="outline" className="text-xs">
                            ✓ Verified
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    Role
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
            const user = row.original;
            return (
                <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                    className={user.role === 'ADMIN' ? 'bg-chart-1 hover:bg-chart-1/90' : ''}
                >
                    {user.role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "totalProducts",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                Products Orderd
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
            const user = row.original;
            return (
                <div className="flex px-8">
                    <span className="font-medium">{user.totalProducts}</span>
                    <span className="text-sm text-muted-foreground ml-1">items</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            return <UserActions user={user} />;
        },
    },
];
