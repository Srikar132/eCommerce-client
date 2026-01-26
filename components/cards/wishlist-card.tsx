'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useRemoveFromWishlist } from '@/lib/tanstack/queries';
import { useAddToCart } from '@/lib/tanstack/queries';
import type { WishlistItem } from '@/lib/api/wishlist';
import { useState } from 'react';

interface WishlistCardProps {
  item: WishlistItem;
}

export function WishlistCard({ item }: WishlistCardProps) {
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const [imageError, setImageError] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist.mutate(item.productId);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.inStock) {
      addToCart.mutate({
        productId: item.productId,
        quantity: 1,
        additionalNotes: ''
      });
    }
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
      <Card className="overflow-hidden border-0 hover:shadow-xl bg-card group">
        {/* Image Container */}
        <div className="relative aspect-[2.9/3] overflow-hidden rounded-3xl m-2 shadow-2xl bg-accent/20">
          {item.primaryImageUrl && !imageError ? (
            <Image
              src={item.primaryImageUrl}
              alt={item.productName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
                <span className="text-muted-foreground text-xs">No image</span>
              </div>
            </div>
          )}
          
          {/* Customizable badge */}
          {item.isCustomizable && (
            <Badge className="absolute top-3 left-3 bg-card text-foreground hover:bg-card border-0 shadow-md uppercase tracking-wide text-xs">
              Customizable
            </Badge>
          )}

          {/* Stock badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`uppercase tracking-wide text-xs shadow-md ${
              item.inStock 
                ? 'bg-card text-foreground hover:bg-card border-0' 
                : 'bg-destructive/90 text-destructive-foreground hover:bg-destructive/90'
            }`}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          {/* Remove Button - Hover Overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <div></div>
            <Button
              onClick={handleRemove}
              size="icon"
              variant="secondary"
              disabled={removeFromWishlist.isPending}
              className="rounded-full h-10 w-10 bg-card hover:bg-destructive/20 hover:text-destructive shadow-md transition-colors"
              aria-label="Remove from wishlist"
            >
              <Trash2 size={18} />
            </Button>
          </div>

          {/* Add to Cart CTA */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={handleAddToCart}
              disabled={!item.inStock || addToCart.isPending}
              className="w-full rounded-none bg-foreground text-background py-6 text-sm font-medium uppercase tracking-wide hover:bg-foreground/90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-1">
          {/* Brand */}
          {item.brandName && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {item.brandName}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-normal text-foreground group-hover:underline line-clamp-2 min-h-10">
            {item.productName}
          </h3>

          {/* Price and Category */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm font-medium text-foreground">
              ${item.basePrice.toFixed(2)}
            </p>
            {item.categoryName && (
              <Badge variant="secondary" className="text-xs rounded-full">
                {item.categoryName}
              </Badge>
            )}
          </div>
          
          {/* Added Date */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Heart className="h-3 w-3 fill-primary text-primary" />
              Saved {formatDate(item.addedAt)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
