"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { Sparkles, Plus, Pencil, Trash2, Loader2, IndianRupee, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";
import {
    useShowcaseProducts,
    useCreateShowcaseProduct,
    useUpdateShowcaseProduct,
    useDeleteShowcaseProduct,
    type ShowcaseProduct,
} from "@/lib/tanstack/queries/content.queries";
import { Skeleton } from "@/components/ui/skeleton";

export function ShowcaseSectionSkeleton() {
    return (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-32" />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
                            <Skeleton className="aspect-square w-full" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function ShowcaseSection() {
    const { data: items = [], isLoading, isError } = useShowcaseProducts();
    const createMutation = useCreateShowcaseProduct();
    const updateMutation = useUpdateShowcaseProduct();
    const deleteMutation = useDeleteShowcaseProduct();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<ShowcaseProduct | null>(null);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [showcaseImage, setShowcaseImage] = useState<UploadedImage[]>([]);
    const [displayOrder, setDisplayOrder] = useState(0);

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ShowcaseProduct | null>(null);

    const resetForm = () => {
        setTitle("");
        setPrice("");
        setShowcaseImage([]);
        setDisplayOrder(0);
        setEditItem(null);
    };

    const handleOpenDialog = (item?: ShowcaseProduct) => {
        if (item) {
            setEditItem(item);
            setTitle(item.title);
            setPrice(item.price);
            setShowcaseImage(item.imageUrl ? [{ url: item.imageUrl }] : []);
            setDisplayOrder(item.displayOrder);
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!title || !price || showcaseImage.length === 0) {
            toast.error("Please fill all required fields and upload an image");
            return;
        }

        const submitData = {
            title,
            price,
            imageUrl: showcaseImage[0].url,
            displayOrder,
        };

        try {
            if (editItem) {
                const result = await updateMutation.mutateAsync({ id: editItem.id, data: submitData });
                toast[result.success ? "success" : "error"](result.message);
            } else {
                const result = await createMutation.mutateAsync(submitData);
                toast[result.success ? "success" : "error"](result.message);
            }
            setIsDialogOpen(false);
            resetForm();
        } catch {
            toast.error("Operation failed");
        }
    };

    const handleDeleteClick = (item: ShowcaseProduct) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        const result = await deleteMutation.mutateAsync(itemToDelete.id);
        toast[result.success ? "success" : "error"](result.message);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const handleToggleActive = async (item: ShowcaseProduct) => {
        const result = await updateMutation.mutateAsync({
            id: item.id,
            data: { isActive: !item.isActive }
        });
        toast[result.success ? "success" : "error"](result.message);
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    if (isLoading) {
        return <ShowcaseSectionSkeleton />;
    }

    if (isError) {
        return (
            <Card className="border border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                    <p className="text-center text-destructive">Failed to load showcase products</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                            </div>
                            Premium Showcase
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Featured products displayed in the showcase section
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-2 shadow-sm"
                                onClick={() => handleOpenDialog()}
                            >
                                <Plus className="h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editItem ? "Edit" : "Add"} Showcase Product</DialogTitle>
                                <DialogDescription>
                                    {editItem ? "Update product details" : "Add a featured product to the showcase section"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Product Title *</Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Rose Pink Embellished"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price *</Label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="1499"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Product Image *</Label>
                                    <ImageUpload
                                        images={showcaseImage}
                                        onImagesChange={setShowcaseImage}
                                        maxImages={1}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Display Order</Label>
                                    <Input
                                        type="number"
                                        value={displayOrder}
                                        onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={isPending}>
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    {editItem ? "Update" : "Add"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 mb-4">
                            <Sparkles className="h-7 w-7 opacity-50" />
                        </div>
                        <p className="font-medium">No showcase products yet</p>
                        <p className="text-sm mt-1">Add featured products to display</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`relative group rounded-xl border overflow-hidden transition-all duration-200 ${item.isActive
                                        ? "border-border/50 hover:border-border hover:shadow-md"
                                        : "border-destructive/30 opacity-60"
                                    }`}
                            >
                                <div className="aspect-square relative bg-muted">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                    {/* Action buttons */}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8 shadow-lg"
                                            onClick={() => handleOpenDialog(item)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8 shadow-lg"
                                            onClick={() => handleDeleteClick(item)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>

                                    {/* Order badge */}
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                                            #{item.displayOrder}
                                        </Badge>
                                    </div>

                                    {/* Status indicator */}
                                    {!item.isActive && (
                                        <div className="absolute bottom-3 left-3">
                                            <Badge variant="destructive" className="text-xs">
                                                Inactive
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-card/80 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold truncate">{item.title}</p>
                                            <p className="text-sm text-primary font-bold mt-0.5 flex items-center">
                                                <IndianRupee className="h-3.5 w-3.5" />
                                                {item.price}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={item.isActive}
                                            onCheckedChange={() => handleToggleActive(item)}
                                            disabled={updateMutation.isPending}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Delete Showcase Product
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{itemToDelete?.title}&quot;</span>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
