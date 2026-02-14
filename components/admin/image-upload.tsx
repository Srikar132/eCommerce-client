"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    Upload,
    X,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    GripVertical,
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface UploadedImage {
    url: string;
    publicId?: string;
    altText?: string;
    isPrimary?: boolean;
    displayOrder?: number;
    isUploading?: boolean;
    error?: string;
    file?: File;
    preview?: string;
}

interface ImageUploadProps {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

export function ImageUpload({
    images,
    onImagesChange,
    maxImages = 10,
    disabled = false,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [uploadingImages, setUploadingImages] = useState<UploadedImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Combine stable images with uploading ones
    const allImages = [...images, ...uploadingImages];

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const uploadFile = async (file: File): Promise<{ url: string; publicId: string }> => {
        const formData = new FormData();
        formData.append('files', file);

        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();

            if (data.uploaded && data.uploaded.length > 0) {
                return {
                    url: data.uploaded[0].url,
                    publicId: data.uploaded[0].publicId,
                };
            }

            throw new Error(data.errors?.[0]?.error || 'Upload failed');
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Upload timed out');
            }
            throw error;
        }
    };

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        if (disabled) return;

        const fileArray = Array.from(files);
        const currentImageCount = images.length;
        const currentUploadingCount = uploadingImages.length;
        const remainingSlots = maxImages - currentImageCount - currentUploadingCount;

        if (remainingSlots <= 0) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        const filesToProcess = fileArray.slice(0, remainingSlots);

        // Create preview images with unique IDs
        const newUploadingImages: UploadedImage[] = filesToProcess.map((file, index) => ({
            url: '',
            preview: URL.createObjectURL(file),
            file,
            isUploading: true,
            isPrimary: currentImageCount === 0 && currentUploadingCount === 0 && index === 0,
            displayOrder: currentImageCount + currentUploadingCount + index,
        }));

        // Add to uploading state
        setUploadingImages(prev => [...prev, ...newUploadingImages]);

        // Upload all files
        const uploadResults: { success: boolean; previewUrl: string; uploaded?: { url: string; publicId: string }; error?: string }[] = [];

        for (const [i, file] of filesToProcess.entries()) {
            const previewUrl = newUploadingImages[i].preview!;
            try {
                const uploaded = await uploadFile(file);
                uploadResults.push({ success: true, previewUrl, uploaded });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to upload';
                console.error('Upload failed for file:', file.name, errorMessage);
                uploadResults.push({ success: false, previewUrl, error: errorMessage });
            }
        }

        // Get successful uploads
        const successfulUploads: UploadedImage[] = uploadResults
            .filter(r => r.success && r.uploaded)
            .map((result, idx) => ({
                url: result.uploaded!.url,
                publicId: result.uploaded!.publicId,
                altText: '',
                isPrimary: currentImageCount === 0 && idx === 0,
                displayOrder: currentImageCount + idx,
            }));

        // Cleanup preview URLs for successful uploads
        uploadResults.forEach(result => {
            if (result.success && result.previewUrl) {
                URL.revokeObjectURL(result.previewUrl);
            }
        });

        // Clear uploading images that completed (success or fail)
        const processedPreviews = newUploadingImages.map(img => img.preview);
        setUploadingImages(prev => {
            return prev.filter(img => !processedPreviews.includes(img.preview)).map(img => {
                const failedResult = uploadResults.find(r => !r.success && r.previewUrl === img.preview);
                if (failedResult) {
                    return { ...img, isUploading: false, error: failedResult.error };
                }
                return img;
            });
        });

        // Update parent with new images
        if (successfulUploads.length > 0) {
            toast.success(`${successfulUploads.length} image${successfulUploads.length > 1 ? 's' : ''} uploaded`);
            onImagesChange([...images, ...successfulUploads]);
        }

        const failedCount = uploadResults.filter(r => !r.success).length;
        if (failedCount > 0) {
            const firstError = uploadResults.find(r => !r.success)?.error || 'Upload failed';
            toast.error(`${failedCount} image${failedCount > 1 ? 's' : ''} failed: ${firstError}`);
        }
    }, [images, uploadingImages.length, maxImages, onImagesChange, disabled]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    }, [handleFiles]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [handleFiles]);

    const removeImage = useCallback(async (index: number) => {
        if (disabled) return;

        const imageToRemove = images[index];

        // Delete from Cloudinary if it has a publicId
        if (imageToRemove.publicId) {
            try {
                await fetch(`/api/upload?publicId=${encodeURIComponent(imageToRemove.publicId)}`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.error('Failed to delete image from Cloudinary:', error);
            }
        }

        const newImages = images.filter((_, i) => i !== index);

        // If we removed the primary image, make the first one primary
        if (imageToRemove.isPrimary && newImages.length > 0) {
            newImages[0] = { ...newImages[0], isPrimary: true };
        }

        // Update display orders
        const reorderedImages = newImages.map((img, i) => ({
            ...img,
            displayOrder: i,
        }));

        onImagesChange(reorderedImages);
    }, [images, onImagesChange, disabled]);

    const removeUploadingImage = useCallback((preview: string) => {
        setUploadingImages(prev => {
            const img = prev.find(i => i.preview === preview);
            if (img?.preview) {
                URL.revokeObjectURL(img.preview);
            }
            return prev.filter(i => i.preview !== preview);
        });
    }, []);

    const setPrimary = useCallback((index: number) => {
        if (disabled) return;

        const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        }));
        onImagesChange(newImages);
    }, [images, onImagesChange, disabled]);

    const handleImageDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleImageDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        // Update display orders
        const reorderedImages = newImages.map((img, i) => ({
            ...img,
            displayOrder: i,
        }));

        onImagesChange(reorderedImages);
        setDraggedIndex(index);
    };

    const handleImageDragEnd = () => {
        setDraggedIndex(null);
    };

    // Cleanup previews on unmount
    useEffect(() => {
        // Store ref to current uploading images
        const currentUploadingImages = [...uploadingImages];

        return () => {
            currentUploadingImages.forEach(img => {
                if (img.preview) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, [uploadingImages]);

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            {allImages.length < maxImages && (
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
                        "flex flex-col items-center justify-center gap-4 cursor-pointer",
                        isDragging && !disabled
                            ? "border-primary bg-primary/5 scale-[1.02]"
                            : "border-border hover:border-primary/50 hover:bg-muted/30",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleFileSelect}
                        disabled={disabled}
                        className="hidden"
                    />

                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                        isDragging ? "bg-primary/10" : "bg-muted"
                    )}>
                        <Upload className={cn(
                            "w-8 h-8 transition-colors",
                            isDragging ? "text-primary" : "text-muted-foreground"
                        )} />
                    </div>

                    <div className="text-center">
                        <p className="font-medium text-foreground">
                            {isDragging ? "Drop images here" : "Drag & drop images"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            PNG, JPG, WebP or GIF (max 5MB)
                        </p>
                    </div>
                </div>
            )}

            {/* Image Preview Grid */}
            {allImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Stable Images */}
                    {images.map((image, index) => (
                        <div
                            key={`image-${index}-${image.url}`}
                            draggable={!disabled}
                            onDragStart={() => handleImageDragStart(index)}
                            onDragOver={(e) => handleImageDragOver(e, index)}
                            onDragEnd={handleImageDragEnd}
                            className={cn(
                                "group relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                                image.isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border",
                                draggedIndex === index && "scale-95 opacity-50"
                            )}
                        >
                            {image.url && (
                                <Image
                                    src={image.url}
                                    alt={image.altText || `Product image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                />
                            )}

                            {/* Primary Badge */}
                            {image.isPrimary && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                                    Primary
                                </div>
                            )}

                            {/* Drag Handle */}
                            {!disabled && (
                                <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                                    <div className="bg-background/90 backdrop-blur-sm rounded-md p-1">
                                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                            )}

                            {/* Remove Button */}
                            {!disabled && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="h-7 w-7 bg-background/90 backdrop-blur-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Set Primary Button */}
                            {!disabled && !image.isPrimary && (
                                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="w-full h-7 bg-background/90 backdrop-blur-sm text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPrimary(index);
                                        }}
                                    >
                                        <Star className="w-3 h-3 mr-1" />
                                        Set as Primary
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Uploading Images */}
                    {uploadingImages.map((image, index) => (
                        <div
                            key={`uploading-${index}-${image.preview}`}
                            className={cn(
                                "group relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                                "border-border",
                                image.error && "border-destructive"
                            )}
                        >
                            {image.preview && (
                                <Image
                                    src={image.preview}
                                    alt="Uploading..."
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                />
                            )}

                            {/* Loading Overlay */}
                            {image.isUploading && (
                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            )}

                            {/* Error Overlay */}
                            {image.error && (
                                <div className="absolute inset-0 bg-destructive/10 flex flex-col items-center justify-center p-2">
                                    <AlertCircle className="w-6 h-6 text-destructive mb-1" />
                                    <span className="text-xs text-destructive text-center">
                                        {image.error}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2 text-xs"
                                        onClick={() => image.preview && removeUploadingImage(image.preview)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add More Button */}
                    {allImages.length < maxImages && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled}
                            className={cn(
                                "aspect-square rounded-xl border-2 border-dashed border-border",
                                "flex flex-col items-center justify-center gap-2",
                                "hover:border-primary/50 hover:bg-muted/30 transition-colors",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Add More</span>
                        </button>
                    )}
                </div>
            )}

            {/* Image Count */}
            <p className="text-xs text-muted-foreground text-center">
                {images.length} of {maxImages} images uploaded
            </p>
        </div>
    );
}
