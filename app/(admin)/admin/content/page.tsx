"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    LayoutGrid,
    Sparkles,
    MessageSquareQuote,
    ImageIcon,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Star,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";
import {
    getLandingCategories,
    createLandingCategory,
    updateLandingCategory,
    deleteLandingCategory,
    getShowcaseProducts,
    createShowcaseProduct,
    updateShowcaseProduct,
    deleteShowcaseProduct,
    getLandingTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getSliderImages,
    createSliderImage,
    updateSliderImage,
    deleteSliderImage,
    type LandingCategory,
    type ShowcaseProduct,
    type LandingTestimonial,
    type SliderImage,
} from "@/lib/actions/content-actions";

// Category options with their link URLs
const CATEGORY_OPTIONS = [
    { title: "MEN", linkUrl: "/products?category=mens" },
    { title: "WOMEN", linkUrl: "/products?category=womens" },
    { title: "BOYS", linkUrl: "/products?category=kid-boys" },
    { title: "GIRLS", linkUrl: "/products?category=kid-girls" },
] as const;

export default function ContentPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("categories");
    const [categories, setCategories] = useState<LandingCategory[]>([]);
    const [showcaseItems, setShowcaseItems] = useState<ShowcaseProduct[]>([]);
    const [testimonials, setTestimonials] = useState<LandingTestimonial[]>([]);
    const [sliderImgs, setSliderImgs] = useState<SliderImage[]>([]);

    useEffect(() => {
        loadAllContent();
    }, []);

    const loadAllContent = async () => {
        setIsLoading(true);
        try {
            const [cats, showcase, tests, slides] = await Promise.all([
                getLandingCategories(),
                getShowcaseProducts(),
                getLandingTestimonials(),
                getSliderImages(),
            ]);
            setCategories(cats);
            setShowcaseItems(showcase);
            setTestimonials(tests);
            setSliderImgs(slides);
        } catch (error) {
            console.error("Error loading content:", error);
            toast.error("Failed to load content");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="admin-page-title flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                            <LayoutGrid className="h-5 w-5 text-white" />
                        </div>
                        Content Management
                    </h1>
                    <p className="admin-page-description mt-1">
                        Manage landing page content dynamically
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild className="gap-2">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Preview Site
                    </a>
                </Button>
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card border border-border p-1 h-auto flex flex-wrap gap-1">
                    <TabsTrigger
                        value="categories"
                        className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Categories
                        <Badge variant="secondary" className="ml-1">{categories.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="showcase"
                        className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
                    >
                        <Sparkles className="h-4 w-4" />
                        Showcase
                        <Badge variant="secondary" className="ml-1">{showcaseItems.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="testimonials"
                        className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
                    >
                        <MessageSquareQuote className="h-4 w-4" />
                        Testimonials
                        <Badge variant="secondary" className="ml-1">{testimonials.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="slider"
                        className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
                    >
                        <ImageIcon className="h-4 w-4" />
                        Slider
                        <Badge variant="secondary" className="ml-1">{sliderImgs.length}</Badge>
                    </TabsTrigger>
                </TabsList>

                {/* Categories Tab */}
                <TabsContent value="categories">
                    <CategoriesSection
                        categories={categories}
                        onRefresh={loadAllContent}
                    />
                </TabsContent>

                {/* Showcase Tab */}
                <TabsContent value="showcase">
                    <ShowcaseSection
                        items={showcaseItems}
                        onRefresh={loadAllContent}
                    />
                </TabsContent>

                {/* Testimonials Tab */}
                <TabsContent value="testimonials">
                    <TestimonialsSection
                        testimonials={testimonials}
                        onRefresh={loadAllContent}
                    />
                </TabsContent>

                {/* Slider Tab */}
                <TabsContent value="slider">
                    <SliderSection
                        images={sliderImgs}
                        onRefresh={loadAllContent}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ==================== CATEGORIES SECTION ====================

function CategoriesSection({
    categories,
    onRefresh,
}: {
    categories: LandingCategory[];
    onRefresh: () => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<LandingCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categoryImage, setCategoryImage] = useState<UploadedImage[]>([]);
    const [displayOrder, setDisplayOrder] = useState(0);

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

        setIsAdding(true);
        try {
            const submitData = {
                title: categoryOption.title,
                imageUrl: categoryImage[0].url,
                linkUrl: categoryOption.linkUrl,
                displayOrder,
            };

            if (editItem) {
                const result = await updateLandingCategory(editItem.id, submitData);
                toast[result.success ? "success" : "error"](result.message);
            } else {
                const result = await createLandingCategory(submitData);
                toast[result.success ? "success" : "error"](result.message);
            }
            setIsDialogOpen(false);
            resetForm();
            onRefresh();
        } catch {
            toast.error("Operation failed");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteLandingCategory(id);
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    const handleToggleActive = async (item: LandingCategory) => {
        const result = await updateLandingCategory(item.id, { isActive: !item.isActive });
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    // Get available categories (not already added, unless editing)
    const getAvailableCategories = () => {
        const usedTitles = categories.map(c => c.title);
        return CATEGORY_OPTIONS.filter(
            opt => !usedTitles.includes(opt.title) || (editItem && editItem.title === opt.title)
        );
    };

    return (
        <Card className="border-0 bg-card shadow-lg rounded-2xl">
            <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <LayoutGrid className="h-5 w-5 text-primary" />
                            Shop by Category
                        </CardTitle>
                        <CardDescription>
                            Manage category cards on the landing page (MEN, WOMEN, BOYS, GIRLS)
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-2"
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
                                <Button onClick={handleSubmit} disabled={isAdding}>
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    {editItem ? "Update" : "Add"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {categories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No categories yet. Add your first category!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className={`relative group rounded-xl border overflow-hidden transition-all ${cat.isActive ? "border-border" : "border-destructive/50 opacity-60"
                                    }`}
                            >
                                <div className="aspect-3/4 relative">
                                    <Image
                                        src={cat.imageUrl}
                                        alt={cat.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenDialog(cat)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8"
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-3 bg-card">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{cat.title}</p>
                                        </div>
                                        <Switch
                                            checked={cat.isActive}
                                            onCheckedChange={() => handleToggleActive(cat)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ==================== SHOWCASE SECTION ====================

function ShowcaseSection({
    items,
    onRefresh,
}: {
    items: ShowcaseProduct[];
    onRefresh: () => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [showcaseImage, setShowcaseImage] = useState<UploadedImage[]>([]);
    const [displayOrder, setDisplayOrder] = useState(0);

    const resetForm = () => {
        setTitle("");
        setPrice("");
        setShowcaseImage([]);
        setDisplayOrder(0);
    };

    const handleSubmit = async () => {
        if (!title || !price || showcaseImage.length === 0) {
            toast.error("Please fill all required fields and upload an image");
            return;
        }

        setIsAdding(true);
        try {
            const result = await createShowcaseProduct({
                title,
                price,
                imageUrl: showcaseImage[0].url,
                displayOrder,
            });
            toast[result.success ? "success" : "error"](result.message);
            setIsDialogOpen(false);
            resetForm();
            onRefresh();
        } catch {
            toast.error("Operation failed");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteShowcaseProduct(id);
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    const handleToggleActive = async (item: ShowcaseProduct) => {
        const result = await updateShowcaseProduct(item.id, { isActive: !item.isActive });
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    return (
        <Card className="border-0 bg-card shadow-lg rounded-2xl">
            <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Premium Showcase
                        </CardTitle>
                        <CardDescription>
                            Featured products in the showcase section
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2" onClick={resetForm}>
                                <Plus className="h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Showcase Product</DialogTitle>
                                <DialogDescription>
                                    Add a featured product to the showcase section
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
                                    <Input
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="1499"
                                    />
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
                                <Button onClick={handleSubmit} disabled={isAdding}>
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Add Product
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {items.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No showcase products yet. Add featured products!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`relative group rounded-xl border overflow-hidden transition-all ${item.isActive ? "border-border" : "border-destructive/50 opacity-60"
                                    }`}
                            >
                                <div className="aspect-square relative">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-3 bg-card">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-primary font-semibold">₹{item.price}</p>
                                        </div>
                                        <Switch
                                            checked={item.isActive}
                                            onCheckedChange={() => handleToggleActive(item)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ==================== TESTIMONIALS SECTION ====================

function TestimonialsSection({
    testimonials,
    onRefresh,
}: {
    testimonials: LandingTestimonial[];
    onRefresh: () => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        customerRole: "Verified Customer",
        reviewText: "",
        rating: 5,
        isVerifiedPurchase: true,
        displayOrder: 0,
    });

    const resetForm = () => {
        setFormData({
            customerName: "",
            customerRole: "Verified Customer",
            reviewText: "",
            rating: 5,
            isVerifiedPurchase: true,
            displayOrder: 0,
        });
    };

    const handleSubmit = async () => {
        if (!formData.customerName || !formData.reviewText) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsAdding(true);
        try {
            const result = await createTestimonial(formData);
            toast[result.success ? "success" : "error"](result.message);
            setIsDialogOpen(false);
            resetForm();
            onRefresh();
        } catch {
            toast.error("Operation failed");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteTestimonial(id);
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    const handleToggleActive = async (item: LandingTestimonial) => {
        const result = await updateTestimonial(item.id, { isActive: !item.isActive });
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    return (
        <Card className="border-0 bg-card shadow-lg rounded-2xl">
            <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquareQuote className="h-5 w-5 text-primary" />
                            Customer Testimonials
                        </CardTitle>
                        <CardDescription>
                            Manage reviews displayed on the landing page
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2" onClick={resetForm}>
                                <Plus className="h-4 w-4" />
                                Add Testimonial
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Testimonial</DialogTitle>
                                <DialogDescription>
                                    Add a verified customer review
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
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
                                        <Input
                                            type="number"
                                            min={1}
                                            max={5}
                                            value={formData.rating}
                                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                                        />
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
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={formData.isVerifiedPurchase}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isVerifiedPurchase: checked })}
                                    />
                                    <Label>Verified Purchase</Label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={isAdding}>
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Add Testimonial
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {testimonials.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageSquareQuote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No testimonials yet. Add customer reviews!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {testimonials.map((item) => (
                            <div
                                key={item.id}
                                className={`relative p-4 rounded-xl border transition-all ${item.isActive ? "border-border bg-muted/20" : "border-destructive/50 opacity-60"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{item.customerName}</h4>
                                            {item.isVerifiedPurchase && (
                                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.customerRole}</p>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm italic">&ldquo;{item.reviewText}&rdquo;</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={item.isActive}
                                            onCheckedChange={() => handleToggleActive(item)}
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ==================== SLIDER SECTION ====================

function SliderSection({
    images,
    onRefresh,
}: {
    images: SliderImage[];
    onRefresh: () => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sliderImage, setSliderImage] = useState<UploadedImage[]>([]);
    const [altText, setAltText] = useState("Fashion image");
    const [displayOrder, setDisplayOrder] = useState(0);

    const resetForm = () => {
        setSliderImage([]);
        setAltText("Fashion image");
        setDisplayOrder(0);
    };

    const handleSubmit = async () => {
        if (sliderImage.length === 0) {
            toast.error("Please upload an image");
            return;
        }

        setIsAdding(true);
        try {
            const result = await createSliderImage({
                imageUrl: sliderImage[0].url,
                altText,
                displayOrder,
            });
            toast[result.success ? "success" : "error"](result.message);
            setIsDialogOpen(false);
            resetForm();
            onRefresh();
        } catch {
            toast.error("Operation failed");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteSliderImage(id);
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    const handleToggleActive = async (item: SliderImage) => {
        const result = await updateSliderImage(item.id, { isActive: !item.isActive });
        toast[result.success ? "success" : "error"](result.message);
        onRefresh();
    };

    return (
        <Card className="border-0 bg-card shadow-lg rounded-2xl">
            <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-primary" />
                            Instagram Slider
                        </CardTitle>
                        <CardDescription>
                            Manage images in the Instagram-style slider
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2" onClick={resetForm}>
                                <Plus className="h-4 w-4" />
                                Add Image
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Slider Image</DialogTitle>
                                <DialogDescription>
                                    Add an image to the Instagram slider
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
                                <Button onClick={handleSubmit} disabled={isAdding}>
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Add Image
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {images.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No slider images yet. Add images to display!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className={`relative group rounded-xl border overflow-hidden transition-all ${img.isActive ? "border-border" : "border-destructive/50 opacity-60"
                                    }`}
                            >
                                <div className="aspect-3/4 relative">
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.altText || "Slider image"}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-7 w-7"
                                            onClick={() => handleDelete(img.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Switch
                                            checked={img.isActive}
                                            onCheckedChange={() => handleToggleActive(img)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
