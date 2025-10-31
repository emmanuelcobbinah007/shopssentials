"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  categoryName?: string;
  subCategoryName?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const leftColumnVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const rightColumnVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/featured-products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          setError("Failed to load featured products");
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const leftProducts = products.slice(0, 2);
  const rightProducts = products.slice(2, 4);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="w-[80%] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1A1D23]">
              Featured Products
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Hand-picked featured products curated for quality and value —
              top-rated items our customers love.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Loading skeleton */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-6">
                <div className="bg-[#F9FAFB] rounded-2xl p-6 animate-pulse">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white py-16">
        <div className="w-[80%] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1A1D23]">
              Featured Products
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Hand-picked featured products curated for quality and value —
              top-rated items our customers love.
            </p>
          </div>
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Products
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#3474c0] hover:bg-[#4f8bd6] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no featured products
  if (products.length === 0) {
    return (
      <div className="bg-white py-16">
        <div className="w-[80%] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1A1D23]">
              Featured Products
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Hand-picked featured products curated for quality and value —
              top-rated items our customers love.
            </p>
          </div>
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Featured Products Yet
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;re currently curating our featured products. Check back
              soon for amazing deals and top-quality items!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#3474c0] hover:bg-[#4f8bd6] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1A1D23]">
            Featured Products
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Hand-picked featured products curated for quality and value —
            top-rated items our customers love.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {/* Left Column */}
          <motion.div variants={leftColumnVariants} className="space-y-6">
            {leftProducts.map((product: Product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group block"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-[#F9FAFB] rounded-2xl p-6 hover:shadow-xl hover:border hover:border-[#3474c0] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-full sm:w-48 h-48 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-lg text-[#1A1D23] mb-2 group-hover:text-[#3474c0] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="text-[#3474c0] font-bold text-xl">
                        {product.price}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Right Column - Offset Down */}
          <motion.div
            variants={rightColumnVariants}
            className="space-y-6 lg:mt-16"
          >
            {rightProducts.map((product: Product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group block"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-[#F9FAFB] rounded-2xl p-6 hover:shadow-xl hover:border hover:border-[#3474c0] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-full sm:w-48 h-48 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-lg text-[#1A1D23] mb-2 group-hover:text-[#3474c0] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="text-[#3474c0] font-bold text-xl">
                        {product.price}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BestSellers;
