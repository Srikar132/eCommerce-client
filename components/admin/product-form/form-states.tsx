"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function LoadingState() {
    return (
        <div className="flex items-center justify-center min-h-100">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading product...</span>
            </div>
        </div>
    );
}

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Product</AlertTitle>
            <AlertDescription className="space-y-3">
                <p>{message}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onRetry}>
                        Try Again
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/products">Go Back</Link>
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}

export function NotFoundState() {
    return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Product Not Found</AlertTitle>
            <AlertDescription className="space-y-3">
                <p>The product you&apos;re trying to edit doesn&apos;t exist.</p>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/products">View All Products</Link>
                </Button>
            </AlertDescription>
        </Alert>
    );
}

interface FormHeaderProps {
    isEditing: boolean;
    isSubmitting: boolean;
}

export function FormHeader({ isEditing, isSubmitting }: FormHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-4">
                <Button type="button" variant="ghost" size="icon" asChild className="shrink-0">
                    <Link href="/admin/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isEditing ? "Edit Product" : "New Product"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEditing ? "Update product details" : "Add a new product to your store"}
                    </p>
                </div>
            </div>
            <div className="flex gap-3 sm:ml-auto">
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 min-w-30"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Package className="h-4 w-4 mr-2" />
                            {isEditing ? "Update" : "Create"}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
