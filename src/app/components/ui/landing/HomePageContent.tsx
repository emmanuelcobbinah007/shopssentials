"use client";

import React from "react";
import Hero from "./Hero";
import FeaturedCategories from "./FeaturedCategories";
import BestSellers from "./BestSellers";
import HowItWorks from "./HowItWorks";
import Newsletter from "./Newsletter";
import { useStorewideSale } from "../../../hooks/useStorewideSale";

const HomePageContent = () => {
  // Fetch storewide sale data
  const { data: saleData } = useStorewideSale();

  const activeSale = saleData?.hasSale
    ? { discountPercent: saleData.discountPercent }
    : null;

  return (
    <>
      <Hero activeSale={activeSale} />
      <FeaturedCategories />
      <BestSellers />
      <HowItWorks />
      <Newsletter />
    </>
  );
};

export default HomePageContent;
