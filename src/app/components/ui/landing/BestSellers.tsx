"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const products = [
  {
    id: 1,
    name: "Professional Shelving Unit",
    price: "$299",
    image: "/images/product1.jpg",
    description: "Heavy-duty steel shelving for maximum storage capacity",
  },
  {
    id: 2,
    name: "Retail Display Stand",
    price: "$159",
    image: "/images/product2.jpg",
    description: "Eye-catching display stand to showcase your best products",
  },
  {
    id: 3,
    name: "POS System Bundle",
    price: "$449",
    image: "/images/product3.jpg",
    description: "Complete point-of-sale system with receipt printer",
  },
  {
    id: 4,
    name: "Shopping Baskets Set",
    price: "$89",
    image: "/images/product4.jpg",
    description: "Durable plastic baskets for customer convenience",
  },
];

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
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const leftProducts = products.slice(0, 2);
  const rightProducts = products.slice(2, 4);

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
            Best Sellers
          </h2>
          <p className="text-gray-500">
            Our most popular shop essentials trusted by retailers
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
            {leftProducts.map((product, index) => (
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
            {rightProducts.map((product, index) => (
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
