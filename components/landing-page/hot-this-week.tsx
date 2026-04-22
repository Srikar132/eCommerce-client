import { getAllProducts } from "@/lib/actions/product-actions"
import HotThisWeekClient from "./hot-this-week-client"
import CustomButton2 from "@/components/ui/custom-button-2"

export default async function HotThisWeek() {
  const { data: products } = await getAllProducts({
    limit: 8,
    sortBy: "CREATED_AT_DESC" // Defaulting to newest as "Hot" for now
  })

  if (!products || products.length === 0) return null

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container">
        {/* Header with Title on Left and Button on Right */}


        {/* Carousel Component */}
        <HotThisWeekClient products={products} />

        {/* Mobile-only button */}
        <div className="mt-12 flex md:hidden justify-center">
          <CustomButton2
            href="/products"
            fillColor="#000000"
            textColor="#000000"
            textHoverColor="#ffffff"
          >
            Shop Full Collection
          </CustomButton2>
        </div>
      </div>
    </section>
  )
}
