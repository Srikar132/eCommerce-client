"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import CustomButton2 from "@/components/ui/custom-button-2"
import { Slider } from "@/components/ui/slider"

const SHOWCASE_DATA = [
  {
    id: 1,
    title: "Cutie finds for Boys",
    tag: "New In",
    description: "Hand-stitched motifs and durable fabrics designed for every little explorer's adventure.",
    image: "/images/home/promise1.png",
    link: "/shop?category=boy",
    aspect: "aspect-[1.5/1]"
  },
  {
    id: 3,
    title: "Artisan Men's Series",
    tag: "Premium",
    description: "Sophisticated, minimalist embroidery for the modern man who appreciates quiet luxury.",
    image: "/images/home/promise3.png",
    link: "/shop?category=men",
    aspect: "aspect-[0.9/1]"
  },
  {
    id: 2,
    title: "Whimsical Girl Styles",
    tag: "Trending",
    description: "Delicate embroidery and playful patterns that bring a touch of magic to her everyday wardrobe.",
    image: "/images/home/promise2.png",
    link: "/shop?category=girl",
    aspect: "aspect-[1.2/1]"
  },
  {
    id: 4,
    title: "Elegant Women's Studio",
    tag: "Exclusive",
    description: "Timeless silhouettes elevated with intricate, hand-crafted details for effortless elegance.",
    image: "/images/home/promise4.png",
    link: "/shop?category=women",
    aspect: "aspect-[1.4/1]"
  }
]


export default function SmoothSliderClient() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    api.on("scroll", () => {
      const scrollProgress = api.scrollProgress()
      setProgress(Math.max(0, Math.min(1, scrollProgress)) * 100)
    })
  }, [api])

  return (
    <section className="bg-white">
      <div className="container overflow-visible mb-5" >
        <span className="text-[11px] font-bold tracking-[0.35em] text-black/30 uppercase mb-4 block">
          Featured Collections
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black">
          Artisan <span className="italic font-serif font-light text-accent">Showcase</span>
        </h2>
      </div>

      <div className="container overflow-visible">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full [&_[data-slot='carousel-content']]:overflow-visible"
        >
          <CarouselContent className="-ml-12">
            {SHOWCASE_DATA.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-12 basis-auto"
              >
                <div className="flex flex-col gap-6 w-[280px] sm:w-[380px] md:w-[480px]">
                  {/* Image Container with variable height based on aspect ratio */}
                  <div className={cn(
                    "relative w-full rounded-[40px] overflow-hidden group bg-muted shadow-lg shadow-black/5",
                    item.aspect
                  )}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Text Content below Image */}
                  <div className="flex flex-col items-start gap-3 pr-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-black/50 leading-relaxed max-w-[340px]">
                      {item.description}
                    </p>
                    <CustomButton2
                      className="mt-2"
                      fillColor="#000000"
                      textColor="#000000"
                      textHoverColor="#ffffff"
                      bgColor="transparent"
                      href={item.link}
                    >
                      Shop Collection
                    </CustomButton2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Custom Controls Footer */}
        <div className="mt-20 flex items-center justify-between gap-12">
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
    </section>
  )
}



