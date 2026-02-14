import ArtOfCreation from "@/components/landing-page/art-of-creation";
import Features from "@/components/landing-page/features";
import HeroSection from "@/components/landing-page/hero-section";
import ShopByCategories from "@/components/landing-page/main-categories";
import OurPromise from "@/components/landing-page/our-promise";
import ShowCaseSection from "@/components/landing-page/show-case-section";
import SmoothSlider from "@/components/landing-page/smooth-slider-wrapper";
import Testimonials from "@/components/landing-page/testimonials-wrapper";

export default function HomeClient() {


  return (
    <div className="w-full overflow-x-hidden">
      {/* 1. HERO - First Impression & Brand Introduction */}
      <HeroSection />

      {/* 2. SHOWCASE - Premium Products Display with Beautiful Background */}
      <ShowCaseSection />

      {/* 3. CATEGORIES - Browse Product Types (Shop by Category) */}
      <ShopByCategories />


      {/* 5. ART OF CREATION - Explain 3-Step Customization Process */}
      <ArtOfCreation />

      {/* 6. OUR PROMISE - Why Choose Us Section */}
      <OurPromise />

      {/* 7. TESTIMONIALS - Customer Reviews & Social Proof */}
      <Testimonials />

      {/* 8. SOCIAL GALLERY - Instagram Feed / User Generated Content */}
      <SmoothSlider />

      {/* 9. FEATURES - Trust Signals (Free Shipping, Quality, 24/7 Support) */}
      <Features />


    </div>
  );
}
