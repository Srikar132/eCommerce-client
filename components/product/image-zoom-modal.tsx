"use client";

import React from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

interface ImageZoomModalProps {
  image: {
    id: string;
    url: string;
    alt: string;
  };
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ 
  image,
  onClose
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
        {/* Close Button */}
        <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-lg">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Image Container */}
        <div className="relative w-full h-[90vh] flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-contain"
              sizes="95vw"
              quality={100}
              priority
            />
          </div>
        </div>

        {/* Image Info */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full text-sm text-muted-foreground shadow-lg">
          <p className="text-xs">{image.alt}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomModal;
