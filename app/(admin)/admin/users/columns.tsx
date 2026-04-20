"use client";

import { useState } from "react";
import { UserWithStats } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, ShieldCheck, ShieldOff, Copy } from "lucide-react";
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
import { useDeleteUser, useUpdateUserRole } from "@/lib/tanstack/queries/user.queries";
import { toast } from "sonner";

// User Actions component
function UserActions({ user }: { user: UserWithStats }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const deleteUserMutation = useDeleteUser();
    const updateRoleMutation = useUpdateUserRole();

    const displayName = user.name || user.email || user.phone || "this user";
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.id);
        toast.success("User ID copied to clipboard");
    };

    const handleDeleteUser = () => {
        deleteUserMutation.mutate(user.id, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                toast.success("User deleted", {
                    description: `${displayName} has been successfully removed.`,
                });
            },
            onError: () => {
                toast.error("Failed to delete user", {
                    description: "Something went wrong. Please try again.",
                });
            },
        });
    };

    const handleToggleRole = () => {
        updateRoleMutation.mutate(
            { userId: user.id, newRole },
            {
                onSuccess: () => {
                    setShowRoleDialog(false);
                    toast.success("Role updated", {
                        description: `${displayName} is now ${newRole === 'ADMIN' ? 'an Admin' : 'a User'}.`,
                    });
                },
                onError: () => {
                    toast.error("Failed to update role", {
                        description: "Something went wrong. Please try again.",
                    });
                },
            }
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 admin-glow-button">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="admin-card w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={handleCopyId}
                        className="cursor-pointer"
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy user ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowRoleDialog(true)}
                        className="cursor-pointer"
                    >
                        {user.role === 'ADMIN' ? (
                            <ShieldOff className="mr-2 h-4 w-4" />
                        ) : (
                            <ShieldCheck className="mr-2 h-4 w-4" />
                        )}
                        Make {newRole === 'ADMIN' ? 'Admin' : 'User'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                        disabled={deleteUserMutation.isPending}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete user
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="admin-card border-destructive/20">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" />
                            Delete User
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{displayName}</strong>? This action cannot be undone and will permanently remove the user and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteUserMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={deleteUserMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Role Change Confirmation Dialog */}
            <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <AlertDialogContent className="admin-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            {newRole === 'ADMIN' ? (
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            ) : (
                                <ShieldOff className="h-5 w-5 text-muted-foreground" />
                            )}
                            Change Role to {newRole}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {newRole === 'ADMIN'
                                ? `This will grant admin privileges to ${displayName}. They will have full access to the admin panel, including managing products, orders, and users.`
                                : `This will revoke admin privileges from ${displayName}. They will only be able to access the customer-facing store.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={updateRoleMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleRole}
                            disabled={updateRoleMutation.isPending}
                            className="admin-primary-button"
                        >
                            {updateRoleMutation.isPending ? "Updating..." : `Make ${newRole === 'ADMIN' ? 'Admin' : 'User'}`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
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
                    <span>{user.phone || '—'}</span>
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
