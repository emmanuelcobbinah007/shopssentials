"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "../../../../../public/images/Hero.jpg";
import AnimatedSearchBar from "./AnimatedSearchBar";
import SearchOverlay from "./SearchOverlay";
import SearchResults from "./SearchResults";
import { useSearch } from "../../../contexts/SearchContext";

const Hero = () => {
  const { isSearchActive } = useSearch();

  return (
    <div className="relative w-full h-[100vh]">
      {/* Background Image */}
      <Image
        src={HeroImage.src}
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />
      {/* White Overlay */}
      <div className="absolute inset-0 bg-white opacity-35 z-10"></div>
      {/* Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/100 z-10"></div>
      <div className="relative z-20 w-[90%] max-w-6xl mx-auto flex flex-col items-center justify-center h-full px-4">
        <div>
          <p className="text-lg md:text-xl font-medium text-center">
            Your No. 1 Shop Plug
          </p>
        </div>
        <div>
          <p className="text-2xl md:text-4xl font-bold text-center mt-4">
            You name it{" "}
            <span className="block sm:inline">
              (
              <TypeAnimation
                sequence={[
                  "Shelves",
                  1500,
                  "Racks",
                  1500,
                  "POS Receipt printer",
                  1500,
                  "Peg Boards",
                  1500,
                  "Price tag guns",
                  1500,
                  "Baskets",
                  1500,
                  "and more",
                  1500,
                ]}
                wrapper="span"
                speed={50}
                cursor={false}
                repeat={Infinity}
                className="text-[#3474c0] font-bold"
              />
              ),
            </span>{" "}
            We&apos;ve got it
          </p>
        </div>
        <div className="relative mt-6 w-full max-w-lg">
          {!isSearchActive && <AnimatedSearchBar />}
        </div>
        <Link href="/shop">
          <button
            className="my-4 inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-3 bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-base md:text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[#3474c033] hover:cursor-pointer"
            aria-label="Shop now"
          >
            <span>Shop Now</span>
          </button>
        </Link>
      </div>

      {/* Search Overlay and Results */}
      {!isSearchActive && (
        <>
          <SearchOverlay />
          <SearchResults />
        </>
      )}
    </div>
  );
};

export default Hero;
