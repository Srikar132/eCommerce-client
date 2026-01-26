import Features from "./landing-page/features";
import HeroSection from "./landing-page/hero-section";
import MCategories from "./landing-page/main-categories";
import ShowCaseSection from "./landing-page/show-case-section";
import SmoothSlider from "./landing-page/smooth-slider";
import Testimonials from "./landing-page/testimonials";
import ArtOfCreation from "./landing-page/art-of-creation";
import CustomStudioShowcase from "./landing-page/custom-studio-showcase";
import Newsletter from "./landing-page/newsletter";
import BestSellers from "./landing-page/best-sellers";
import { Suspense } from "react";



export default function HomeClient() {
  

  return (
    <div className="w-full overflow-x-hidden">
      {/* 1. HERO - First Impression & Brand Introduction */}
      <HeroSection />

      {/* 2. SHOWCASE - Premium Products Display with Beautiful Background */}
      <ShowCaseSection/>

      {/* 3. CATEGORIES - Browse Product Types (Shop by Category) */}
      <MCategories />
      
      {/* 4. BEST SELLERS - Popular Products (Social Proof) */}
      <Suspense fallback={<></>}>
        <BestSellers />
      </Suspense>

      {/* 5. ART OF CREATION - Explain 3-Step Customization Process */}
      <ArtOfCreation />

      {/* 6. CUSTOM STUDIO - Interactive Customization Demo */}
      <CustomStudioShowcase />

      {/* 7. TESTIMONIALS - Customer Reviews & Social Proof */}
      <Testimonials />
      
      {/* 8. SOCIAL GALLERY - Instagram Feed / User Generated Content */}
      <SmoothSlider />

      {/* 9. FEATURES - Trust Signals (Free Shipping, Quality, 24/7 Support) */}
      <Features />

      {/* 10. NEWSLETTER - Lead Capture & Email Signup (Final CTA) */}
      <Newsletter />
      
    </div>
  );
}
