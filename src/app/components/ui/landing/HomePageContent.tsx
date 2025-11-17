"use client";

import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import FeaturedCategories from "./FeaturedCategories";
import BestSellers from "./BestSellers";
import HowItWorks from "./HowItWorks";
import Newsletter from "./Newsletter";
import { useStorewideSale } from "../../../hooks/useStorewideSale";

const HomePageContent = () => {
  const { data: saleData, isLoading } = useStorewideSale();
  const [activeSale, setActiveSale] = useState<{
    discountPercent: number;
  } | null>(null);

  // Prevent flash by setting sale data once it's loaded
  useEffect(() => {
    if (!isLoading && saleData) {
      setActiveSale(
        saleData.hasSale ? { discountPercent: saleData.discountPercent } : null
      );
    }
  }, [saleData, isLoading]);

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
