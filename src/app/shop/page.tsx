"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "../components/ui/landing/Sidebar";

// Mock products data - in a real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: "Professional Shelving Unit",
    price: "GHS299",
    originalPrice: "GHS349",
    image: "/images/product1.jpeg",
    description: "Heavy-duty steel shelving for maximum storage capacity",
    category: "shelving",
    rating: 4.5,
    reviews: 23,
    inStock: true,
    isOnSale: true,
  },
  {
    id: 2,
    name: "Retail Display Stand",
    price: "GHS159",
    image: "/images/product2.jpg",
    description: "Eye-catching display stand to showcase your best products",
    category: "displays",
    rating: 4.2,
    reviews: 15,
    inStock: true,
    isOnSale: false,
  },
  {
    id: 3,
    name: "POS System Bundle",
    price: "GHS449",
    image: "/images/product3.jpg",
    description: "Complete point-of-sale system with receipt printer",
    category: "pos",
    rating: 4.8,
    reviews: 31,
    inStock: false,
    isOnSale: false,
  },
  {
    id: 4,
    name: "Shopping Baskets Set",
    price: "GHS89",
    image: "/images/product4.jpg",
    description: "Durable plastic baskets for customer convenience",
    category: "accessories",
    rating: 4.0,
    reviews: 8,
    inStock: true,
    isOnSale: false,
  },
  {
    id: 5,
    name: "Price Tag Gun",
    price: "GHS45",
    originalPrice: "GHS55",
    image: "/images/product1.jpg",
    description: "Professional price tag gun for retail labeling",
    category: "accessories",
    rating: 4.3,
    reviews: 12,
    inStock: true,
    isOnSale: true,
  },
  {
    id: 6,
    name: "Peg Board Display",
    price: "GHS120",
    image: "/images/product2.jpg",
    description: "Customizable peg board display system",
    category: "displays",
    rating: 4.1,
    reviews: 9,
    inStock: true,
    isOnSale: false,
  },
  {
    id: 7,
    name: "Cash Register",
    price: "GHS199",
    image: "/images/product3.jpg",
    description: "Electronic cash register with thermal printer",
    category: "pos",
    rating: 4.6,
    reviews: 18,
    inStock: true,
    isOnSale: false,
  },
  {
    id: 8,
    name: "Storage Rack System",
    price: "GHS399",
    image: "/images/product1.jpeg",
    description: "Industrial storage rack system for warehouses",
    category: "shelving",
    rating: 4.7,
    reviews: 27,
    inStock: true,
    isOnSale: false,
  },
];

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isOnSale: boolean;
}

interface Filters {
  category: string;
  priceRange: [number, number];
  inStockOnly: boolean;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle category filtering
  const handleCategoryChange = (category: string) => {
    let filtered = allProducts;

    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    setFilteredProducts(filtered);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Handle other filters
  const handleFiltersChange = (filters: {
    priceRange: [number, number];
    rating: number;
    inStockOnly: boolean;
  }) => {
    let filtered = allProducts;

    // Category filter (maintain current category selection)
    const currentCategory =
      filteredProducts.length < allProducts.length
        ? filteredProducts[0]?.category || "all"
        : "all";

    if (currentCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === currentCategory
      );
    }

    // Price range filter
    filtered = filtered.filter((product) => {
      const price = parseInt(product.price.replace("GHS", ""));
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Rating filter (if implemented)
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    setFilteredProducts(filtered);
    setIsSidebarOpen(false); // Close sidebar on mobile after applying filters
  };

  // Handle sorting
  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return (
            parseInt(a.price.replace("GHS", "")) -
            parseInt(b.price.replace("GHS", ""))
          );
        case "price-high":
          return (
            parseInt(b.price.replace("GHS", "")) -
            parseInt(a.price.replace("GHS", ""))
          );
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id; // Assuming higher ID = newer
        default:
          return 0;
      }
    });
    setFilteredProducts(sorted);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Product card component
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Link
      href={`/product/${product.id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group block"
    >
      <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isOnSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            SALE
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm sm:text-base">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#3474c0] transition-colors text-sm sm:text-base">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg sm:text-xl font-bold text-[#3474c0]">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
      </div>
    </Link>
  );

  return (
    <div>
      <div className="h-16"></div>
      <main className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            onCategoryChange={handleCategoryChange}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full">
              <Sidebar
                onCategoryChange={handleCategoryChange}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>
        )}

        <div className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Shop All Products
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 bg-[#3474c0] text-white px-4 py-2 rounded-lg hover:bg-[#4f8bd6] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Filters
                  </button>
                </div>
              </div>

              {/* Sort and View Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="sort"
                      className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3474c0] min-w-0 sm:min-w-[180px]"
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 border border-gray-300 rounded-md p-1 self-start sm:self-auto">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-[#3474c0] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="Grid view"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-[#3474c0] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="List view"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Try adjusting your filters or search criteria.
                </p>
                <button
                  onClick={() => {
                    setFilteredProducts(allProducts);
                    handleCategoryChange("all");
                  }}
                  className="bg-[#3474c0] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#4f8bd6] transition-colors text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;
