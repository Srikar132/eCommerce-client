'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import type { WishlistItem } from '@/types/wishlist';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/constants';

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (productId: string) => void;
  isRemoving: boolean;
}

export function WishlistCard({ item, onRemove, isRemoving }: WishlistCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item.productId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Link href={`/products/${item.productSlug}`} className="block">
      <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300 bg-card">
        {/* Image Container */}
        <div className="relative aspect-3/4 overflow-hidden bg-muted">
          <Image
            src={item.primaryImageUrl || PLACEHOLDER_IMAGE}
            alt={item.primaryImageAlt || item.productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />

          {/* Remove from Wishlist Button */}
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className={cn(
              "absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200",
              "opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          </button>

          {/* Stock Status Badge */}
          {!item.inStock && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-destructive/90 backdrop-blur-sm rounded text-xs text-destructive-foreground font-medium">
              Out of Stock
            </div>
          )}

          {/* Added Date Badge */}
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Saved {formatDate(item.addedAt)}
          </div>
        </div>

        <CardContent className="p-3 space-y-1">
          {/* Product Name */}
          <h3 className="text-sm font-normal text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-10">
            {item.productName}
          </h3>

          {/* Price and Category */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-semibold text-foreground">
              ${item.basePrice.toFixed(2)}
            </p>
            {item.categoryName && (
              <span className="text-xs text-muted-foreground">
                {item.categoryName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
