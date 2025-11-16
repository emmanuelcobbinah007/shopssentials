"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroImage from "../../../../../public/images/Hero.jpg";
import AnimatedSearchBar from "./AnimatedSearchBar";
import SearchOverlay from "./SearchOverlay";
import SearchResults from "./SearchResults";
import { useSearch } from "../../../contexts/SearchContext";

interface HeroProps {
  activeSale?: {
    discountPercent: number;
  } | null;
}

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const Hero = ({ activeSale }: HeroProps) => {
  const { isSearchActive } = useSearch();

  // Dynamic content based on active sale
  const heroContent = activeSale
    ? {
        title: `STOREWIDE SALE - ${activeSale.discountPercent}% OFF`,
        subtitle: "Limited time offer on all items • Don't miss out!",
        buttonText: "Shop Sale",
        buttonLink: "/shop",
        urgencyText: "While supplies last",
      }
    : {
        title: "You name it, We've got it",
        subtitle: "Your No. 1 Shop Plug",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        urgencyText: null,
      };

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
      <div className="relative z-20 w-[90%] max-w-6xl mx-auto h-full px-4">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full"
        >
          <motion.div variants={itemVariants}>
            <div>
              <p
                className={`text-lg md:text-xl font-medium text-center ${
                  activeSale ? "text-red-600 font-bold" : ""
                }`}
              >
                {heroContent.subtitle}
              </p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div>
              <p
                className={`text-2xl md:text-4xl font-bold text-center mt-4 ${
                  activeSale ? "text-red-700" : ""
                }`}
              >
                {activeSale ? (
                  heroContent.title
                ) : (
                  <>
                    You name it{" "}
                    <span className="block sm:inline">
                      (
                      <TypeAnimation
                        sequence={[
                          "Shelves_",
                          1500,
                          "Racks_",
                          1500,
                          "POS Receipt printers_",
                          1500,
                          "Peg Boards_",
                          1500,
                          "Price tag guns_",
                          1500,
                          "Baskets_",
                          1500,
                          "and more_",
                          1500,
                        ]}
                        wrapper="span"
                        speed={35}
                        cursor={true}
                        repeat={Infinity}
                        className="text-[#3474c0] font-bold"
                      />
                      ),
                    </span>{" "}
                    We&apos;ve got it
                  </>
                )}
              </p>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 w-full max-w-lg"
          >
            <div className="w-full">
              {!isSearchActive && <AnimatedSearchBar />}
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="absolute top-full mt-24 left-1/2 transform -translate-x-1/2"
          >
            <Link href={heroContent.buttonLink}>
              <button
                className={`my-4 inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-3 ${
                  activeSale
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    : "bg-gradient-to-r from-[#3474c0] to-[#4f8bd6]"
                } text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-base md:text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[#3474c033] hover:cursor-pointer`}
                aria-label={heroContent.buttonText}
              >
                <span>{heroContent.buttonText}</span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
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
