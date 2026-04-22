import ArtOfCreation from "@/components/landing-page/art-of-creation";
import HeroSection from "@/components/landing-page/hero-section";
import ScrollingBanner from "@/components/landing-page/scrolling-banner";
import OurPromise from "@/components/landing-page/our-promise";
import SmoothSlider from "@/components/landing-page/smooth-slider-wrapper";
import HotThisWeek from "@/components/landing-page/hot-this-week";
import ShopByCategories from "@/components/landing-page/main-categories";
import Testimonials from "@/components/landing-page/testimonials";
import { getActiveCategories, getActiveHeroSlides, getActiveTestimonials } from "@/lib/actions/content-actions";

export default async function Home() {
  // Fetch all data in parallel for the landing page
  const [heroSlidesRaw, categories, testimonials] = await Promise.all([
    getActiveHeroSlides(),
    getActiveCategories(),
    getActiveTestimonials()
  ]);

  return (
    <div className="w-full bg-background min-h-screen relative overflow-hidden">
      {/* 1. HERO - High-Impact First Impression */}
      <HeroSection slides={heroSlidesRaw} />

      {/* 3. CATEGORIES - Direct Collections Access */}
      <ShopByCategories categories={categories} />

      {/* 2. SCROLLING BANNER - Immediate Brand Identity & Energy */}
      <ScrollingBanner />

      {/* 4. TRENDING - "Hot This Week" (Validation & Fast Conversion) */}
      <HotThisWeek />

      {/* 5. BOUTIQUE SHOWCASE - High-End Editorial Storytelling */}
      <SmoothSlider />

      {/* 6. TESTIMONIALS - Social Proof */}
      <Testimonials testimonials={testimonials} />

      {/* 7. ART OF CREATION - The Craftsmanship Narrative ("The Why") */}
      <ArtOfCreation />

      {/* 8. OUR PROMISE - Quality Assurance & Brand Values */}
      <OurPromise />
    </div>
  );
}
