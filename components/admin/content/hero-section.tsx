"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { LayoutPanelTop, Plus, Pencil, Trash2, Loader2, AlertTriangle, ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";
import {
    useHeroSlides,
    useCreateHeroSlide,
    useUpdateHeroSlide,
    useDeleteHeroSlide,
    type HeroSlide,
} from "@/lib/tanstack/queries/content.queries";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSectionSkeleton() {
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
                            <Skeleton className="aspect-video w-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function HeroSection() {
    const { data: slides = [], isLoading, isError } = useHeroSlides();
    const createMutation = useCreateHeroSlide();
    const updateMutation = useUpdateHeroSlide();
    const deleteMutation = useDeleteHeroSlide();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<HeroSlide | null>(null);
    const [heroImage, setHeroImage] = useState<UploadedImage[]>([]);
    const [eyebrow, setEyebrow] = useState("");
    const [heading, setHeading] = useState("");
    const [buttonLabel, setButtonLabel] = useState("");
    const [altText, setAltText] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);
    const [textColor, setTextColor] = useState("#FFFFFF");


    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<HeroSlide | null>(null);

    const resetForm = () => {
        setHeroImage([]);
        setEyebrow("");
        setHeading("");
        setButtonLabel("");
        setAltText("");
        setDisplayOrder(0);
        setTextColor("#FFFFFF");
        setEditItem(null);
    };


    const handleOpenDialog = (item?: HeroSlide) => {
        if (item) {
            setEditItem(item);
            setHeroImage(item.imageUrl ? [{ url: item.imageUrl }] : []);
            setEyebrow(item.eyebrow);
            setHeading(item.heading);
            setButtonLabel(item.buttonLabel);
            setAltText(item.altText);
            setDisplayOrder(item.displayOrder);
            setTextColor(item.textColor || "#FFFFFF");
        } else {

            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (heroImage.length === 0) {
            toast.error("Please upload an image");
            return;
        }

        if (!eyebrow || !heading || !buttonLabel) {
            toast.error("Please fill in all required fields");
            return;
        }

        const submitData = {
            imageUrl: heroImage[0].url,
            altText: altText || heading,
            eyebrow,
            heading,
            textColor,
            buttonLabel,
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

    const handleDeleteClick = (item: HeroSlide) => {
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

    const handleToggleActive = async (item: HeroSlide) => {
        const result = await updateMutation.mutateAsync({
            id: item.id,
            data: { isActive: !item.isActive }
        });
        toast[result.success ? "success" : "error"](result.message);
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    if (isLoading) {
        return <HeroSectionSkeleton />;
    }

    if (isError) {
        return (
            <Card className="border border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                    <p className="text-center text-destructive">Failed to load hero slides</p>
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500/20 to-blue-500/20">
                                <LayoutPanelTop className="h-4 w-4 text-indigo-500" />
                            </div>
                            Hero Carousel
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Manage the slides in the main hero carousel on your home page
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
                                Add Slide
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-0 bg-card border border-border/50 shadow-2xl rounded-3xl">
                            <div className="p-8 sm:p-10">
                                <DialogHeader className="mb-10 text-center">
                                    <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <DialogTitle className="text-3xl font-extrabold tracking-tight">
                                        {editItem ? "Edit Slide" : "New Hero Slide"}
                                    </DialogTitle>
                                    <DialogDescription className="text-muted-foreground mt-2 text-base">
                                        Create a beautiful banner for your storefront.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-10">
                                    {/* Section 1: Visuals */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-1 w-8 bg-primary rounded-full" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">The Visual</span>
                                        </div>
                                        <div className="rounded-3xl border-2 border-dashed border-border/40 p-2 hover:border-primary/30 transition-colors">
                                            <ImageUpload
                                                images={heroImage}
                                                onImagesChange={setHeroImage}
                                                maxImages={1}
                                                folder="nala-armoire/hero"
                                            />
                                        </div>
                                        <p className="text-[10px] text-center text-muted-foreground">
                                            Recommended size: 1920x820px (21:9 ratio)
                                        </p>
                                    </div>

                                    {/* Section 2: Copy */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-1 w-8 bg-primary rounded-full" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">The Message</span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2 group">
                                                <Label htmlFor="eyebrow" className="text-xs font-bold text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">EYEBROW TEXT</Label>
                                                <Input
                                                    id="eyebrow"
                                                    value={eyebrow}
                                                    onChange={(e) => setEyebrow(e.target.value)}
                                                    placeholder="e.g. HANDCRAFTED ELEGANCE"
                                                    className="h-12 bg-muted/30 border-border/50 rounded-2xl focus-visible:ring-primary/20 transition-all px-5"
                                                />
                                            </div>

                                            <div className="space-y-2 group">
                                                <Label htmlFor="heading" className="text-xs font-bold text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">MAIN HEADING</Label>
                                                <Textarea
                                                    id="heading"
                                                    value={heading}
                                                    onChange={(e) => setHeading(e.target.value)}
                                                    placeholder={"Line 1\nLine 2 (Press Enter for new line)"}
                                                    rows={3}
                                                    className="bg-muted/30 border-border/50 rounded-2xl focus-visible:ring-primary/20 transition-all resize-none px-5 py-4 text-lg font-bold leading-tight"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2 group">
                                                    <Label htmlFor="buttonLabel" className="text-xs font-bold text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">BUTTON LABEL</Label>
                                                    <Input
                                                        id="buttonLabel"
                                                        value={buttonLabel}
                                                        onChange={(e) => setButtonLabel(e.target.value)}
                                                        placeholder="Shop Now"
                                                        className="h-12 bg-muted/30 border-border/50 rounded-2xl focus-visible:ring-primary/20 transition-all px-5"
                                                    />
                                                </div>
                                                <div className="space-y-2 group">
                                                    <Label htmlFor="displayOrder" className="text-xs font-bold text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">ORDER</Label>
                                                    <Input
                                                        id="displayOrder"
                                                        type="number"
                                                        value={displayOrder}
                                                        onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                                                        className="h-12 bg-muted/30 border-border/50 rounded-2xl focus-visible:ring-primary/20 transition-all px-5"
                                                    />
                                                </div>
                                                <div className="space-y-2 group">
                                                    <Label htmlFor="textColor" className="text-xs font-bold text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">TEXT COLOR</Label>
                                                    <div className="flex items-center gap-3 h-12 bg-muted/30 border-border/50 rounded-2xl px-5 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                                                        <Input
                                                            id="textColor"
                                                            type="color"
                                                            value={textColor}
                                                            onChange={(e) => setTextColor(e.target.value)}
                                                            className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer"
                                                        />
                                                        <Input
                                                            type="text"
                                                            value={textColor}
                                                            onChange={(e) => setTextColor(e.target.value)}
                                                            placeholder="#FFFFFF"
                                                            className="flex-1 bg-transparent border-0 focus-visible:ring-0 px-0 uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setIsDialogOpen(false)} 
                                        className="w-full sm:w-32 rounded-2xl h-12 font-semibold hover:bg-muted/50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleSubmit} 
                                        disabled={isPending} 
                                        className="w-full sm:w-48 rounded-2xl h-12 font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                                    >
                                        {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        {editItem ? "Save Changes" : "Create Slide"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {slides.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/40 rounded-2xl bg-muted/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm mb-4">
                            <LayoutPanelTop className="h-8 w-8 text-primary/40" />
                        </div>
                        <p className="font-semibold text-foreground">No hero slides yet</p>
                        <p className="text-sm mt-1 max-w-[250px] text-center">
                            Create your first slide to start building your brand story.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {slides.map((slide) => (
                            <div
                                key={slide.id}
                                className={`relative group rounded-2xl border overflow-hidden transition-all duration-300 ${slide.isActive
                                        ? "border-border/50 hover:border-primary/30 hover:shadow-xl"
                                        : "border-destructive/20 opacity-70 grayscale-[0.3]"
                                    }`}
                            >
                                <div className="aspect-[21/9] relative bg-muted">
                                    <Image
                                        src={slide.imageUrl}
                                        alt={slide.altText}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    
                                    {/* Content Overlay - Preview style */}
                                    <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center px-10 sm:px-16 pointer-events-none">
                                        <p 
                                            className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 drop-shadow-md opacity-90"
                                            style={{ color: slide.textColor }}
                                        >
                                            {slide.eyebrow}
                                        </p>
                                        <h3 
                                            className="text-sm sm:text-lg lg:text-xl font-bold whitespace-pre-line leading-[1.1] drop-shadow-lg"
                                            style={{ color: slide.textColor }}
                                        >
                                            {slide.heading}
                                        </h3>
                                        <div className="mt-4 inline-flex h-7 items-center rounded-full bg-white/20 backdrop-blur-md px-4 border border-white/30">
                                            <span 
                                                className="text-[10px] font-semibold uppercase tracking-wider"
                                                style={{ color: slide.textColor }}
                                            >
                                                {slide.buttonLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-9 w-9 shadow-xl backdrop-blur-xl bg-white/10 hover:bg-white/30 text-white border border-white/20"
                                            onClick={() => handleOpenDialog(slide)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-9 w-9 shadow-xl"
                                            onClick={() => handleDeleteClick(slide)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Order badge */}
                                    <div className="absolute top-4 left-4">
                                        <Badge variant="secondary" className="bg-white/10 text-white border border-white/20 backdrop-blur-xl text-[10px] font-bold px-2.5 py-0.5 tracking-tighter">
                                            SLIDE #{slide.displayOrder}
                                        </Badge>
                                    </div>

                                    {/* Status and Toggle */}
                                    <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full pl-3 pr-1 py-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${slide.isActive ? 'text-green-400' : 'text-destructive-foreground'}`}>
                                            {slide.isActive ? 'Live' : 'Hidden'}
                                        </span>
                                        <Switch
                                            checked={slide.isActive}
                                            onCheckedChange={() => handleToggleActive(slide)}
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
                            Delete Hero Slide
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this hero slide?
                            This will remove it from the home page carousel immediately.
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
                                "Delete Slide"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
