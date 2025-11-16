import React from "react";
import { Poppins } from "next/font/google";

import Hero from "./components/ui/landing/Hero";
import FeaturedCategories from "./components/ui/landing/FeaturedCategories";
import BestSellers from "./components/ui/landing/BestSellers";
import HowItWorks from "./components/ui/landing/HowItWorks";
import Newsletter from "./components/ui/landing/Newsletter";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Client component that handles the storewide sale logic
function HomePageContent() {
  // This will be implemented as a client component
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <HowItWorks />
      <Newsletter />
    </>
  );
}

const page = () => {
  return (
    <div
      className={`${poppins.variable} font-poppins text-[#1A1D23] bg-[#FEFFFE]`}
    >
      <HomePageContent />
    </div>
  );
};

export default page;
