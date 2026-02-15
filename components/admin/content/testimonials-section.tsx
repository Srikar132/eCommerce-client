"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { MessageSquareQuote, Plus, Pencil, Trash2, Loader2, Star, Quote, BadgeCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
    useTestimonials,
    useCreateTestimonial,
    useUpdateTestimonial,
    useDeleteTestimonial,
    type LandingTestimonial,
} from "@/lib/tanstack/queries/content.queries";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsSectionSkeleton() {
    return (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-44" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-36" />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl border border-border/50 p-5">
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function TestimonialsSection() {
    const { data: testimonials = [], isLoading, isError } = useTestimonials();
    const createMutation = useCreateTestimonial();
    const updateMutation = useUpdateTestimonial();
    const deleteMutation = useDeleteTestimonial();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<LandingTestimonial | null>(null);
    const [formData, setFormData] = useState({
        customerName: "",
        customerRole: "Verified Customer",
        reviewText: "",
        rating: 5,
        isVerifiedPurchase: true,
        displayOrder: 0,
    });

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<LandingTestimonial | null>(null);

    const resetForm = () => {
        setFormData({
            customerName: "",
            customerRole: "Verified Customer",
            reviewText: "",
            rating: 5,
            isVerifiedPurchase: true,
            displayOrder: 0,
        });
        setEditItem(null);
    };

    const handleOpenDialog = (item?: LandingTestimonial) => {
        if (item) {
            setEditItem(item);
            setFormData({
                customerName: item.customerName,
                customerRole: item.customerRole || "Verified Customer",
                reviewText: item.reviewText,
                rating: item.rating,
                isVerifiedPurchase: item.isVerifiedPurchase,
                displayOrder: item.displayOrder,
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.customerName || !formData.reviewText) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            if (editItem) {
                const result = await updateMutation.mutateAsync({ id: editItem.id, data: formData });
                toast[result.success ? "success" : "error"](result.message);
            } else {
                const result = await createMutation.mutateAsync(formData);
                toast[result.success ? "success" : "error"](result.message);
            }
            setIsDialogOpen(false);
            resetForm();
        } catch {
            toast.error("Operation failed");
        }
    };

    const handleDeleteClick = (item: LandingTestimonial) => {
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

    const handleToggleActive = async (item: LandingTestimonial) => {
        const result = await updateMutation.mutateAsync({
            id: item.id,
            data: { isActive: !item.isActive }
        });
        toast[result.success ? "success" : "error"](result.message);
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    if (isLoading) {
        return <TestimonialsSectionSkeleton />;
    }

    if (isError) {
        return (
            <Card className="border border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                    <p className="text-center text-destructive">Failed to load testimonials</p>
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                                <MessageSquareQuote className="h-4 w-4 text-blue-500" />
                            </div>
                            Customer Testimonials
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Manage reviews displayed on the landing page
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
                                Add Testimonial
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editItem ? "Edit" : "Add"} Testimonial</DialogTitle>
                                <DialogDescription>
                                    {editItem ? "Update testimonial details" : "Add a verified customer review"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Customer Name *</Label>
                                        <Input
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            placeholder="Sarah Mitchell"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role/Title</Label>
                                        <Input
                                            value={formData.customerRole}
                                            onChange={(e) => setFormData({ ...formData, customerRole: e.target.value })}
                                            placeholder="Fashion Enthusiast"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Review Text *</Label>
                                    <Textarea
                                        value={formData.reviewText}
                                        onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                                        placeholder="Write the customer's review..."
                                        rows={4}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Rating (1-5)</Label>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 transition-colors ${star <= formData.rating
                                                                ? "text-yellow-500 fill-yellow-500"
                                                                : "text-muted-foreground/30"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Display Order</Label>
                                        <Input
                                            type="number"
                                            value={formData.displayOrder}
                                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Switch
                                        checked={formData.isVerifiedPurchase}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isVerifiedPurchase: checked })}
                                    />
                                    <div>
                                        <Label className="cursor-pointer">Verified Purchase</Label>
                                        <p className="text-xs text-muted-foreground">Show verification badge</p>
                                    </div>
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
                {testimonials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 mb-4">
                            <MessageSquareQuote className="h-7 w-7 opacity-50" />
                        </div>
                        <p className="font-medium">No testimonials yet</p>
                        <p className="text-sm mt-1">Add customer reviews to display</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.map((item) => (
                            <div
                                key={item.id}
                                className={`relative group rounded-xl border p-5 transition-all duration-200 ${item.isActive
                                        ? "border-border/50 bg-card/50 hover:border-border hover:shadow-md"
                                        : "border-destructive/30 bg-destructive/5 opacity-60"
                                    }`}
                            >
                                {/* Quote icon */}
                                <Quote className="absolute top-4 right-4 h-8 w-8 text-muted-foreground/10" />

                                <div className="space-y-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                                {item.customerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold">{item.customerName}</h4>
                                                    {item.isVerifiedPurchase && (
                                                        <BadgeCheck className="h-4 w-4 text-blue-500" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{item.customerRole}</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            #{item.displayOrder}
                                        </Badge>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < item.rating
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-muted-foreground/20"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Review text */}
                                    <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-3">
                                        &ldquo;{item.reviewText}&rdquo;
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={item.isActive}
                                                onCheckedChange={() => handleToggleActive(item)}
                                                disabled={updateMutation.isPending}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {item.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => handleOpenDialog(item)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteClick(item)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
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
                            Delete Testimonial
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the testimonial from <span className="font-semibold text-foreground">{itemToDelete?.customerName}</span>?
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
