"use client"

import DealSection from "./landing-page/deal-section";
import Features from "./landing-page/features";
import HeroSection from "./landing-page/hero-section";
import MCategories from "./landing-page/main-categories";
import ShowCaseSection from "./landing-page/show-case-section";
import SmoothSlider from "./landing-page/smooth-slider";
import SplitScreenHero from "./landing-page/split-screen";
import Testimonials from "./landing-page/testimonials";



export default function HomeClient() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <HeroSection />

      <ShowCaseSection/>
      
      <MCategories />

      <SplitScreenHero />

      <DealSection />

      <Testimonials />
      
      <SmoothSlider />


      <Features />


    </div>
  );
}
