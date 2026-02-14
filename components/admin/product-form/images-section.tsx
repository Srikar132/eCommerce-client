"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { ImageUpload, UploadedImage } from "@/components/admin/image-upload";

interface ImagesSectionProps {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    maxImages?: number;
    disabled: boolean;
}

export function ImagesSection({
    images,
    onImagesChange,
    maxImages = 8,
    disabled,
}: ImagesSectionProps) {
    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Product Images
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ImageUpload
                    images={images}
                    onImagesChange={onImagesChange}
                    maxImages={maxImages}
                    disabled={disabled}
                />
            </CardContent>
        </Card>
    );
}
