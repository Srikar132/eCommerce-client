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
import { ImageIcon, Plus, Pencil, Trash2, Loader2, Instagram, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";
import {
    useSliderImages,
    useCreateSliderImage,
    useUpdateSliderImage,
    useDeleteSliderImage,
    type SliderImage,
} from "@/lib/tanstack/queries/content.queries";
import { Skeleton } from "@/components/ui/skeleton";

export function SliderSectionSkeleton() {
    return (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-36" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-9 w-28" />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
                            <Skeleton className="aspect-3/4 w-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function SliderSection() {
    const { data: images = [], isLoading, isError } = useSliderImages();
    const createMutation = useCreateSliderImage();
    const updateMutation = useUpdateSliderImage();
    const deleteMutation = useDeleteSliderImage();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<SliderImage | null>(null);
    const [sliderImage, setSliderImage] = useState<UploadedImage[]>([]);
    const [altText, setAltText] = useState("Fashion image");
    const [displayOrder, setDisplayOrder] = useState(0);

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<SliderImage | null>(null);

    const resetForm = () => {
        setSliderImage([]);
        setAltText("Fashion image");
        setDisplayOrder(0);
        setEditItem(null);
    };

    const handleOpenDialog = (item?: SliderImage) => {
        if (item) {
            setEditItem(item);
            setSliderImage(item.imageUrl ? [{ url: item.imageUrl }] : []);
            setAltText(item.altText || "Fashion image");
            setDisplayOrder(item.displayOrder);
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (sliderImage.length === 0) {
            toast.error("Please upload an image");
            return;
        }

        const submitData = {
            imageUrl: sliderImage[0].url,
            altText,
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

    const handleDeleteClick = (item: SliderImage) => {
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

    const handleToggleActive = async (item: SliderImage) => {
        const result = await updateMutation.mutateAsync({
            id: item.id,
            data: { isActive: !item.isActive }
        });
        toast[result.success ? "success" : "error"](result.message);
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    if (isLoading) {
        return <SliderSectionSkeleton />;
    }

    if (isError) {
        return (
            <Card className="border border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                    <p className="text-center text-destructive">Failed to load slider images</p>
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20">
                                <Instagram className="h-4 w-4 text-pink-500" />
                            </div>
                            Instagram Slider
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Manage images in the Instagram-style slider section
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
                                Add Image
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editItem ? "Edit" : "Add"} Slider Image</DialogTitle>
                                <DialogDescription>
                                    {editItem ? "Update image details" : "Add an image to the Instagram slider"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Slider Image *</Label>
                                    <ImageUpload
                                        images={sliderImage}
                                        onImagesChange={setSliderImage}
                                        maxImages={1}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Alt Text</Label>
                                    <Input
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        placeholder="Fashion post"
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
                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 mb-4">
                            <ImageIcon className="h-7 w-7 opacity-50" />
                        </div>
                        <p className="font-medium">No slider images yet</p>
                        <p className="text-sm mt-1">Add images to display in the slider</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className={`relative group rounded-xl border overflow-hidden transition-all duration-200 ${img.isActive
                                        ? "border-border/50 hover:border-border hover:shadow-md"
                                        : "border-destructive/30 opacity-60"
                                    }`}
                            >
                                <div className="aspect-3/4 relative bg-muted">
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.altText || "Slider image"}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                    {/* Action buttons */}
                                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-7 w-7 shadow-lg"
                                            onClick={() => handleOpenDialog(img)}
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-7 w-7 shadow-lg"
                                            onClick={() => handleDeleteClick(img)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Order badge */}
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs px-1.5 py-0.5">
                                            #{img.displayOrder}
                                        </Badge>
                                    </div>

                                    {/* Status indicator */}
                                    {!img.isActive && (
                                        <div className="absolute bottom-2 left-2">
                                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                                Off
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Toggle switch on hover */}
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Switch
                                            checked={img.isActive}
                                            onCheckedChange={() => handleToggleActive(img)}
                                            disabled={updateMutation.isPending}
                                            className="data-[state=checked]:bg-green-500"
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
                            Delete Slider Image
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this slider image?
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
