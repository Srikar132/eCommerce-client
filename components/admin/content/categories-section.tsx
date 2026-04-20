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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { LayoutGrid, Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";
import {
    useLandingCategories,
    useCreateLandingCategory,
    useUpdateLandingCategory,
    useDeleteLandingCategory,
    type LandingCategory,
} from "@/lib/tanstack/queries/content.queries";
import { Skeleton } from "@/components/ui/skeleton";

// Category options with their link URLs
const CATEGORY_OPTIONS = [
    { title: "MEN", linkUrl: "/products?category=mens" },
    { title: "WOMEN", linkUrl: "/products?category=womens" },
    { title: "BOYS", linkUrl: "/products?category=kid-boys" },
    { title: "GIRLS", linkUrl: "/products?category=kid-girls" },
] as const;

export function CategoriesSectionSkeleton() {
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
                            <Skeleton className="aspect-3/4 w-full" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function CategoriesSection() {
    const { data: categories = [], isLoading, isError } = useLandingCategories();
    const createMutation = useCreateLandingCategory();
    const updateMutation = useUpdateLandingCategory();
    const deleteMutation = useDeleteLandingCategory();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<LandingCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categoryImage, setCategoryImage] = useState<UploadedImage[]>([]);
    const [displayOrder, setDisplayOrder] = useState(0);

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<LandingCategory | null>(null);

    const resetForm = () => {
        setSelectedCategory("");
        setCategoryImage([]);
        setDisplayOrder(0);
        setEditItem(null);
    };

    const handleOpenDialog = (cat?: LandingCategory) => {
        if (cat) {
            setEditItem(cat);
            setSelectedCategory(cat.title);
            setCategoryImage(cat.imageUrl ? [{ url: cat.imageUrl }] : []);
            setDisplayOrder(cat.displayOrder);
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedCategory || categoryImage.length === 0) {
            toast.error("Please select a category and upload an image");
            return;
        }

        const categoryOption = CATEGORY_OPTIONS.find(c => c.title === selectedCategory);
        if (!categoryOption) {
            toast.error("Invalid category selected");
            return;
        }

        const submitData = {
            title: categoryOption.title,
            imageUrl: categoryImage[0].url,
            linkUrl: categoryOption.linkUrl,
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

    const handleDeleteClick = (cat: LandingCategory) => {
        setItemToDelete(cat);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        const result = await deleteMutation.mutateAsync(itemToDelete.id);
        toast[result.success ? "success" : "error"](result.message);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const handleToggleActive = async (item: LandingCategory) => {
        const result = await updateMutation.mutateAsync({
            id: item.id,
            data: { isActive: !item.isActive }
        });
        toast[result.success ? "success" : "error"](result.message);
    };

    // Get available categories (not already added, unless editing)
    const getAvailableCategories = () => {
        const usedTitles = categories.map(c => c.title);
        return CATEGORY_OPTIONS.filter(
            opt => !usedTitles.includes(opt.title) || (editItem && editItem.title === opt.title)
        );
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    if (isLoading) {
        return <CategoriesSectionSkeleton />;
    }

    if (isError) {
        return (
            <Card className="border border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                    <p className="text-center text-destructive">Failed to load categories</p>
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <LayoutGrid className="h-4 w-4 text-primary" />
                            </div>
                            Shop by Category
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Manage category cards on the landing page (MEN, WOMEN, BOYS, GIRLS)
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-2 shadow-sm"
                                onClick={() => handleOpenDialog()}
                                disabled={getAvailableCategories().length === 0}
                            >
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editItem ? "Edit" : "Add"} Category</DialogTitle>
                                <DialogDescription>
                                    {editItem ? "Update category details" : "Add a new category to the landing page"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Category *</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableCategories().map((cat) => (
                                                <SelectItem key={cat.title} value={cat.title}>
                                                    {cat.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category Image *</Label>
                                    <ImageUpload
                                        images={categoryImage}
                                        onImagesChange={setCategoryImage}
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
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/40 rounded-2xl bg-muted/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm mb-4">
                            <LayoutGrid className="h-8 w-8 text-primary/40" />
                        </div>
                        <p className="font-semibold text-foreground">No categories yet</p>
                        <p className="text-sm mt-1 max-w-[200px] text-center">
                            Add your main categories to help customers navigate.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className={`relative group rounded-2xl border overflow-hidden transition-all duration-300 ${cat.isActive
                                        ? "border-border/50 hover:border-primary/30 hover:shadow-xl bg-card"
                                        : "border-destructive/20 opacity-70 grayscale-[0.2] bg-muted/30"
                                    }`}
                            >
                                <div className="aspect-3/4 relative bg-muted overflow-hidden">
                                    <Image
                                        src={cat.imageUrl}
                                        alt={cat.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
                                    {/* Action buttons */}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8 shadow-xl backdrop-blur-md bg-white/20 hover:bg-white/40 text-white border-0"
                                            onClick={() => handleOpenDialog(cat)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8 shadow-xl"
                                            onClick={() => handleDeleteClick(cat)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
 
                                    {/* Order badge */}
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-md text-[10px] font-bold px-2 py-0.5">
                                            #{cat.displayOrder}
                                        </Badge>
                                    </div>
 
                                    {/* Status indicator */}
                                    {!cat.isActive && (
                                        <div className="absolute bottom-3 left-3">
                                            <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-tight">
                                                Inactive
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-bold tracking-tight truncate text-foreground">{cat.title}</p>
                                            <p className="text-[10px] text-muted-foreground truncate font-medium">{cat.linkUrl}</p>
                                        </div>
                                        <Switch
                                            checked={cat.isActive}
                                            onCheckedChange={() => handleToggleActive(cat)}
                                            disabled={updateMutation.isPending}
                                            className="data-[state=checked]:bg-green-500 scale-75"
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
                            Delete Category
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the <span className="font-semibold text-foreground">{itemToDelete?.title}</span> category?
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
