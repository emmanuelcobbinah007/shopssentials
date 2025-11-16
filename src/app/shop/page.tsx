"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../components/ui/landing/Sidebar";
import { useCart } from "../contexts/CartContext";
import { useProducts, Product, useCategories } from "../hooks/useProducts";
import { ShoppingBag } from "iconsax-reactjs";

// Loading component for Suspense
function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ShopPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({
    categoryId: "all",
    subCategoryId: "all",
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    search: "",
  });

  // Fetch categories to convert category name to ID
  const { data: categoriesData } = useCategories();

  // Use TanStack Query for products
  const { data, isLoading } = useProducts({
    ...currentFilters,
    sortBy,
    page: currentPage,
    limit: 20, // Show 20 products per page
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  // Log the products returned from the API
  console.log("Products from API:", products);
  console.log("Pagination info:", pagination);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters, sortBy]);

  // Set initial filter from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    console.log("URL category parameter:", categoryFromUrl);
    console.log("Categories data:", categoriesData);

    if (categoryFromUrl && categoriesData) {
      // Convert category name to category ID
      const category = categoriesData.find(
        (cat) => cat.name.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      console.log("Found category:", category);

      const categoryId = category ? category.id : "all";
      console.log("Category ID to set:", categoryId);

      setCurrentFilters((prev) => {
        if (categoryId !== prev.categoryId) {
          console.log("Setting new category filter:", categoryId);
          return {
            ...prev,
            categoryId: categoryId,
          };
        }
        return prev;
      });
    } else if (!categoryFromUrl) {
      // If no category in URL, reset to "all"
      setCurrentFilters((prev) => {
        if (prev.categoryId !== "all") {
          console.log("Resetting category filter to all");
          return {
            ...prev,
            categoryId: "all",
          };
        }
        return prev;
      });
    }
  }, [searchParams, categoriesData]);

  // Handle sidebar animation
  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarVisible(true);
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => {
        setIsSidebarVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen]);

  // Handle opening sidebar with animation
  const openSidebar = () => {
    setIsSidebarVisible(true);
    setTimeout(() => {
      setIsSidebarOpen(true);
    }, 10);
  };

  // Handle closing sidebar with animation
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle category filtering
  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { ...currentFilters, categoryId };
    setCurrentFilters(newFilters);

    // Update URL parameters to reflect the category change
    const params = new URLSearchParams();
    if (categoryId !== "all" && categoriesData) {
      const category = categoriesData.find((cat) => cat.id === categoryId);
      if (category) {
        params.set("category", category.name);
      }
    }

    // Update URL without page reload
    const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
    router.push(newUrl, { scroll: false });

    closeSidebar();
  };

  // Handle other filters
  const handleFiltersChange = (filters: {
    priceRange: [number, number];
    rating: number;
    inStockOnly: boolean;
  }) => {
    const newFilters = {
      ...currentFilters,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      inStock: filters.inStockOnly,
    };
    setCurrentFilters(newFilters);
    closeSidebar();
  };

  // Handle sorting
  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
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
  const ProductCard: React.FC<{
    product: Product;
    viewMode: "grid" | "list";
  }> = ({ product, viewMode }) => {
    const { addToCart, isInCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Convert product to match CartContext Product interface
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      };
      addToCart(cartProduct, 1);
    };

    if (viewMode === "list") {
      return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row">
            <Link
              href={`/product/${product.id}`}
              className="flex flex-col sm:flex-row flex-1"
            >
              <div className="relative w-full sm:w-48 h-32 sm:h-24 bg-gray-100 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none overflow-hidden flex-shrink-0 p-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 rounded"
                />
                {product.isOnSale && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    SALE
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#3474c0] transition-colors text-lg">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      {product.price ? (
                        <>
                          <span className="text-xl font-bold text-[#3474c0]">
                            {product.price}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-[#3474c0]">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sm:ml-6 mt-4 sm:mt-0">
                    {product.inStock ? (
                      <button
                        onClick={handleAddToCart}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          isInCart(product.id)
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-[#3474c0] text-white hover:bg-[#2a5a9e]"
                        }`}
                      >
                        <ShoppingBag size={16} />
                        {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group">
        <Link href={`/product/${product.id}`} className="block">
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
            <div className="flex items-center gap-2 md:mb-2">
              {product.price ? (
                <>
                  <span className="text-xl font-bold text-[#3474c0]">
                    {product.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-[#3474c0]">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <p className="hidden md:block text-xs sm:text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          </div>
        </Link>
        <div className="p-3 sm:p-4 pt-0">
          {product.inStock ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isInCart(product.id)
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-[#3474c0] text-white hover:bg-[#2a5a9e]"
              }`}
            >
              <ShoppingBag size={16} />
              {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 px-4 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="h-24"></div>
      <main className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            onCategoryChange={handleCategoryChange}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarVisible && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className={`absolute inset-0 backdrop-blur-sm bg-[#D5E8FA]/30 transition-opacity duration-300 ${
                isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeSidebar}
            />
            <div
              className={`absolute left-0 top-0 h-full transform transition-transform duration-300 ease-out ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
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
                    {products.length} product
                    {products.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <button
                    onClick={openSidebar}
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
                      <option value="rating">Highest Rated</option>
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="items-center gap-2 border border-gray-300 rounded-md p-1 self-start sm:self-auto hidden sm:flex">
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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3474c0]"></div>
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
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
                    const resetFilters = {
                      categoryId: "all",
                      subCategoryId: "all",
                      minPrice: 0,
                      maxPrice: 10000,
                      inStock: false,
                      search: "",
                    };
                    setCurrentFilters(resetFilters);
                    setSortBy("name");
                    setCurrentPage(1);
                    // Also clear URL parameters
                    window.history.pushState({}, "", "/shop");
                  }}
                  className="bg-[#3474c0] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#4f8bd6] transition-colors text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum =
                      Math.max(
                        1,
                        Math.min(pagination.totalPages - 4, currentPage - 2)
                      ) + i;
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          currentPage === pageNum
                            ? "bg-[#3474c0] text-white border-[#3474c0]"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ShopPage: React.FC = () => {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;
