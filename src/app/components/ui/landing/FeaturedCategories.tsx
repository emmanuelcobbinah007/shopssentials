"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCategories } from "../../../hooks/useProducts";
import Link from "next/link";

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {},
};

const cardVariants = (index: number, total: number) => {
  const centerIndex = Math.floor(total / 2);
  const distanceFromCenter = Math.abs(index - centerIndex);
  const delay = distanceFromCenter * 0.15; // 0.15s delay per step from center

  return {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
      },
    },
  };
};

const FeaturedCategories: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: categories, isLoading, error } = useCategories();

  useEffect(() => {
    if (categories && categories.length > 0 && !isLoading) {
      // Small delay to ensure smooth transition from loading to animation
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [categories, isLoading]);

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#1A1D23]">
            Featured Categories
          </h2>
          <p className="text-gray-500 mb-12">
            Intentional categories to bring your store to life
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {[...Array(5)].map((_, i) => {
            const totalItems = 5;
            const isOddCount = totalItems % 2 === 1;
            const isLastItem = i === totalItems - 1;
            const shouldSpanTwo = isOddCount && isLastItem;

            return (
              <div
                key={i}
                className={`animate-pulse bg-gray-200 rounded-2xl h-44 ${
                  shouldSpanTwo ? "col-span-2 sm:col-span-1" : ""
                }`}
              ></div>
            );
          })}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#1A1D23]">
          Featured Categories
        </h2>
        <p className="text-red-600">
          Unable to load categories. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#FAFAFA] py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#1A1D23]">
          Featured Categories
        </h2>
        <p className="text-gray-500 mb-12">
          Intentional categories to bring your store to life
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
        >
          {categories && categories.length > 0 ? (
            categories.map((category, index) => {
              const isOddCount = categories.length % 2 === 1;
              const isLastItem = index === categories.length - 1;
              const shouldSpanTwo = isOddCount && isLastItem;

              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.name}`}
                  className={`group ${
                    shouldSpanTwo ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <motion.div
                    variants={cardVariants(index, categories.length)}
                    className="relative flex flex-col items-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-50 mb-5 border border-gray-100 group-hover:border-gray-300 transition-colors duration-300">
                      {category.imageURL ? (
                        <Image
                          src={category.imageURL}
                          alt={`${category.name} Icon`}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No Image</span>
                      )}
                    </div>
                    <h3 className="text-base font-medium text-[#1A1D23] group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </motion.div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No categories available</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
