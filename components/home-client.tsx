"use client"

import BestSeller from "./best-seller";
import DealSection from "./deal-section";
import HeroSection from "./hero-section";
import MCategories from "./main-categories";
import SplitScreenHero from "@/components/split-screen";
import SmoothSlider from "@/components/smooth-slider";
import Features from "@/components/Features";
import Footer from "@/components/Footer";


export default function HomeClient() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <HeroSection />

      <MCategories />

      <BestSeller />


      <SplitScreenHero />


      <DealSection />

      <SmoothSlider />  

      <Features />
    </div>
  );
}
