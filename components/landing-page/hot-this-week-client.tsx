"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import CustomButton2 from "@/components/ui/custom-button-2"
import { Slider } from "@/components/ui/slider"
import ProductCard from "@/components/cards/product-card"
import { Product } from "@/types/product"
import { useCartContext } from "@/context/cart-context"
import { useProductOptions } from "@/context/product-options-context"
import { useRouter } from "next/navigation"

interface HotThisWeekClientProps {
  products: Product[];
  title?: string;
  showButton?: boolean;
}

export default function HotThisWeekClient({
  products,
  title = "Hot This Week",
  showButton = true
}: HotThisWeekClientProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [progress, setProgress] = React.useState(0)
  const { isFetching: isCartFetching } = useCartContext()
  const { openOptions } = useProductOptions()
  const router = useRouter()

  React.useEffect(() => {
    if (!api) return

    api.on("scroll", () => {
      const scrollProgress = api.scrollProgress()
      setProgress(Math.max(0, Math.min(1, scrollProgress)) * 100)
    })
  }, [api])

  const handleAddToCart = React.useCallback((product: Product) => {
    openOptions(product)
  }, [openOptions])

  const handleQuickView = React.useCallback((slug: string) => {
    router.push(`/products/${slug}`)
  }, [router])

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-10 md:mb-16">
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-widest text-primary/60">
            Curated collection
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
            {title}
          </h2>
        </div>

        {showButton && (
          <div className="hidden md:block">
            <CustomButton2
              href="/products"
              bgColor="#000000"
              fillColor="#ffffff"
              textColor="#ffffff"
              textHoverColor="#000000"
              className="h-14 px-10"
            >
              View all products
            </CustomButton2>
          </div>
        )}
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full [&_[data-slot='carousel-content']]:overflow-visible"
      >
        <CarouselContent className="-ml-6 md:-ml-8">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-6 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/4"
            >
              <ProductCard
                product={product}
                onAddToCartClick={() => handleAddToCart(product)}
                onQuickViewClick={() => handleQuickView(product.slug)}
                isUpdating={isCartFetching}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Custom Controls Footer */}
      <div className="mt-16 flex items-center justify-between gap-12">
        {/* Progress Slider (Left) */}
        <div className="flex-1 max-w-[200px]">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            className="cursor-default"
            disabled
          />
        </div>

        {/* Navigation Arrows (Right) */}
        <div className="flex items-center gap-3">
          <CustomButton2
            onClick={() => api?.scrollPrev()}
            className="w-14 h-14 !px-0 rounded-full flex items-center justify-center border border-black/10"
            bgColor="transparent"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
          </CustomButton2>
          <CustomButton2
            onClick={() => api?.scrollNext()}
            className="w-14 h-14 !px-0 rounded-full flex items-center justify-center border border-black/10"
            bgColor="transparent"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
          </CustomButton2>
        </div>
      </div>
    </div>
  )
}
