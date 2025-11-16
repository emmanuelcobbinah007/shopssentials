"use client";

import React from "react";
import Hero from "./Hero";
import { useStorewideSale } from "../../../hooks/useStorewideSale";

const HeroWithSale = () => {
  // Fetch storewide sale data
  const { data: saleData } = useStorewideSale();

  const activeSale = saleData?.hasSale
    ? { discountPercent: saleData.discountPercent }
    : null;

  return (
    <>
      <Hero activeSale={activeSale} />
    </>
  );
};

export default HeroWithSale;
