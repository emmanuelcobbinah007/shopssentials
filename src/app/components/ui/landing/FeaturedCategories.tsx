"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCategories } from "../../../hooks/useCategories";
import Link from "next/link";

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: { opacity: 0, y: 30, transition: { duration: 0.4 } },
};

const FeaturedCategories: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const { categories, loading, error } = useCategories();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-48"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Categories
          </h2>
          <p className="text-red-600">
            Unable to load categories. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="w-[80%] mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1A1D23]">
          Featured Categories
        </h2>
        <p className="text-gray-500 mb-10">
          Find everything you need to bring your shop to life
        </p>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          <AnimatePresence>
            {categories.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.name}`}>
                <motion.div
                  variants={cardVariants}
                  exit="exit"
                  className="flex flex-col items-center p-6 bg-[#F9FAFB] rounded-xl shadow hover:shadow-lg hover:scale-105 transition hover:border hover:border-blue-500 duration-300 cursor-pointer"
                >
                  <Image
                    src={category.imageURL}
                    alt={`${category.name} Icon`}
                    width={64}
                    height={64}
                  />
                  <h3 className="mt-4 font-medium text-[#1A1D23]">
                    {category.name}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
