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
    DialogFooter,
} from "@/components/ui/dialog";
import { LayoutGrid, Pencil, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";
import {
    useCategories,
    useUpdateCategory,
} from "@/lib/tanstack/queries/product.queries";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSectionSkeleton() {
    return (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </div>
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
    const { data: categories = [], isLoading, isError } = useCategories();
    const updateMutation = useUpdateCategory();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [categoryImage, setCategoryImage] = useState<UploadedImage[]>([]);
    const [displayOrder, setDisplayOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);

    const handleOpenDialog = (item: any) => {
        setEditItem(item);
        setCategoryImage(item.imageUrl ? [{ url: item.imageUrl }] : []);
        setDisplayOrder(item.displayOrder || 0);
        setIsActive(item.isActive ?? true);
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!editItem) return;

        const submitData = {
            imageUrl: categoryImage.length > 0 ? categoryImage[0].url : undefined,
            displayOrder,
            isActive,
        };

        try {
            const result = await updateMutation.mutateAsync({ id: editItem.id, data: submitData });
            toast[result.success ? "success" : "error"](result.message);
            setIsDialogOpen(false);
        } catch {
            toast.error("Operation failed");
        }
    };

    const handleToggleActive = async (item: any) => {
        const result = await updateMutation.mutateAsync({
            id: item.id,
            data: { isActive: !item.isActive }
        });
        toast[result.success ? "success" : "error"](result.message);
    };

    const isPending = updateMutation.isPending;

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
                            Category Display Settings
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Manage images and display order for your store categories.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/40 rounded-2xl bg-muted/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm mb-4">
                            <LayoutGrid className="h-8 w-8 text-primary/40" />
                        </div>
                        <p className="font-semibold text-foreground">No categories found</p>
                        <p className="text-sm mt-1">Add categories in the Products section first.</p>
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
                                    {cat.imageUrl ? (
                                        <Image
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
                                            <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                                            <span className="text-xs font-medium">No Image</span>
                                        </div>
                                    )}
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
                                                Hidden
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-bold tracking-tight truncate text-foreground">{cat.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate font-medium">/{cat.slug}</p>
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Category Display</DialogTitle>
                        <DialogDescription>
                            Update the visual representation of <strong>{editItem?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Image</Label>
                            <div className="rounded-xl border-2 border-dashed border-border/50 p-2">
                                <ImageUpload
                                    images={categoryImage}
                                    onImagesChange={setCategoryImage}
                                    maxImages={1}
                                    folder="nala-armoire/categories"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center">
                                Recommended: 800x1000px (Portrait)
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Order</Label>
                                <Input
                                    type="number"
                                    value={displayOrder}
                                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                                    className="h-10 bg-muted/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visibility</Label>
                                <div className="flex items-center h-10 gap-2 px-3 border rounded-md bg-muted/30">
                                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                                    <span className="text-sm font-medium">{isActive ? "Visible" : "Hidden"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isPending} className="rounded-xl min-w-[100px]">
                            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
