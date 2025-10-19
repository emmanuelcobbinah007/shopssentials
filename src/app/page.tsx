import React from "react";
import { Poppins } from "next/font/google";

import Header from "./components/ui/landing/Header";
import Hero from "./components/ui/landing/Hero";
import FeaturedCategories from "./components/ui/landing/FeaturedCategories";
import Footer from "./components/ui/landing/Footer";
import BestSellers from "./components/ui/landing/BestSellers";
import HowItWorks from "./components/ui/landing/HowItWorks";
import Newsletter from "./components/ui/landing/Newsletter";
import { SearchProvider } from "./contexts/SearchContext";
import FixedSearchButton from "./components/ui/landing/FixedSearchButton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const page = () => {
  return (
    <div
      className={`${poppins.variable} font-poppins text-[#1A1D23] bg-[#FEFFFE]`}
    >
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <HowItWorks />
      <Newsletter />
    </div>
  );
};

export default page;
