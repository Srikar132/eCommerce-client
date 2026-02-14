import Image from "next/image";
import HomePremiumProductCard from "../cards/home-premimum-product-card";
import { getActiveShowcaseProducts } from "@/lib/actions/content-actions";

export default async function ShowCaseSection() {
  const showcaseProducts = await getActiveShowcaseProducts();

  return (
    <section className="relative w-full overflow-hidden min-h-screen lg:min-h-[110vh] py-16 sm:py-20 md:py-24">

      {/* TOP BLUR GRADIENT OVERLAY */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-10 bg-linear-to-b from-background via-background/80 to-transparent z-10 pointer-events-none" />

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/images/home/premium-bg.webp"
          alt="Showcase Background"
          fill
          className="object-cover object-center saturate-110 brightness-95 select-none pointer-events-none"
          priority
          sizes="100vw"
        />
      </div>

      {/* WAVE CUT AT BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#FCFCF4"
          />
        </svg>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[80vh]">

          {/* LEFT SIDE*/}
          <div />

          {/* RIGHT SIDE - Product Cards */}
          <div className="flex flex-col items-center space-y-8 sm:space-y-10 lg:space-y-12 py-8 lg:py-0">
            {showcaseProducts.slice(0, 2).map((product, index) => (
              <div
                key={product.id}
                className={`transform hover:scale-105 transition-all duration-500 ${index === 0 ? '-rotate-3 hover:rotate-0' : 'rotate-6 hover:rotate-0 lg:mr-12'
                  }`}
              >
                <HomePremiumProductCard
                  image={product.imageUrl}
                  title={product.title}
                  price={parseFloat(product.price)}
                  imageAlt={product.title}
                />
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}