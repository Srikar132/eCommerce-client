"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Download, Archive } from "lucide-react";
import { useBulkDeleteProducts } from "@/hooks/use-product-mutations";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BulkActionsProps {
    selectedRowIds: string[];
    onClearSelection: () => void;
}

export function BulkActions({ selectedRowIds, onClearSelection }: BulkActionsProps) {
    const bulkDeleteMutation = useBulkDeleteProducts();
    const selectedCount = selectedRowIds.length;

    if (selectedCount === 0) return null;

    const handleBulkDelete = async () => {
        bulkDeleteMutation.mutate(selectedRowIds, {
            onSuccess: (result) => {
                if (result.success) {
                    onClearSelection();
                }
            }
        });
    };

    return (
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border">
            <span className="text-sm text-muted-foreground">
                {selectedCount} product{selectedCount === 1 ? '' : 's'} selected
            </span>

            <div className="flex items-center gap-1 ml-auto">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        // Export selected products to CSV
                        toast.info("Export functionality coming soon!");
                    }}
                >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        // Archive selected products
                        toast.info("Archive functionality coming soon!");
                    }}
                >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={bulkDeleteMutation.isPending}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {bulkDeleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Products</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete {selectedCount} product{selectedCount === 1 ? '' : 's'}?
                                This action cannot be undone and will remove all associated variants, images, and order history.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleBulkDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={bulkDeleteMutation.isPending}
                            >
                                {bulkDeleteMutation.isPending ? "Deleting..." : "Delete Products"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                >
                    Clear Selection
                </Button>
            </div>
        </div>
    );
}