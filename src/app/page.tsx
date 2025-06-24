import React from "react";

import Header from "./components/ui/landing/Header";
import Hero from "./components/ui/landing/Hero";
import FeaturedCategories from "./components/ui/landing/FeaturedCategories";

const page = () => {
  return (
    <div className="font-poppins text-[#1A1D23] bg-[#FEFFFE]">
      <Header />
      <Hero />
      <FeaturedCategories />
    </div>
  );
};

export default page;
