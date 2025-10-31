"use client";
import React, { useState } from "react";
import { useCategories } from "../../../hooks/useProducts";

interface Filters {
  priceRange: [number, number];
  rating: number;
  inStockOnly: boolean;
}

interface SidebarProps {
  onCategoryChange?: (category: string) => void;
  onFiltersChange?: (filters: Filters) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onCategoryChange,
  onFiltersChange,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Use TanStack Query for categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const categories = categoriesData || [];

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  // Function to get icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: React.JSX.Element } = {
      shelving: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="6" rx="1" />
          <rect x="3" y="15" width="18" height="6" rx="1" />
        </svg>
      ),
      displays: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="12" rx="1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v4" />
        </svg>
      ),
      pos: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
        </svg>
      ),
      accessories: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.5V6a2 2 0 00-2-2h-5.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5V18a2 2 0 002 2h11"
          />
          <circle cx="12" cy="11.5" r="2" />
        </svg>
      ),
    };

    return (
      iconMap[categoryName.toLowerCase()] || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7h18l-1.5 9a2 2 0 01-2 1.5H6.5A2 2 0 014.5 16L3 7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 3a2 2 0 11-4 0"
          />
        </svg>
      )
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedRating(0);
    setInStockOnly(false);
    setActiveCategory("all");
    onCategoryChange?.("all");
    onFiltersChange?.({
      priceRange: [0, 1000],
      rating: 0,
      inStockOnly: false,
    });
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen overflow-y-auto sidebar-scroll transition-all duration-300 sticky top-0 ${
        isCollapsed ? "w-16" : "w-80"
      }`}
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-semibold text-[#1A1D23]">Filters</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Categories Section */}
      <div className="p-4 border-b border-gray-100">
        {!isCollapsed && (
          <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        )}
        <div
          className={`space-y-2 ${
            isCollapsed ? "flex flex-col items-center" : ""
          }`}
        >
          {/* All Products option */}
          <button
            onClick={() => handleCategorySelect("all")}
            className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
              activeCategory === "all"
                ? "bg-[#3474c0] text-white"
                : "hover:bg-gray-50 text-gray-700"
            } ${isCollapsed ? "w-10 h-10" : "w-full justify-between"}`}
            title={isCollapsed ? "All Products" : undefined}
          >
            <span className="text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7h18l-1.5 9a2 2 0 01-2 1.5H6.5A2 2 0 014.5 16L3 7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 3a2 2 0 11-4 0"
                />
              </svg>
            </span>
            {!isCollapsed && (
              <>
                <span className="font-medium flex-1 text-left ml-3">
                  All Products
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    activeCategory === "all"
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {categories.reduce(
                    (total, cat) => total + (cat.count || 0),
                    0
                  )}
                </span>
              </>
            )}
          </button>

          {/* Loading state */}
          {categoriesLoading && !isCollapsed && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3474c0]"></div>
              <span className="ml-2 text-sm text-gray-600">
                Loading categories...
              </span>
            </div>
          )}

          {/* Error state */}
          {categoriesError && !isCollapsed && (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 mb-2">
                {categoriesError.message || "Failed to load categories"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-[#3474c0] hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Categories from API */}
          {!categoriesLoading &&
            !categoriesError &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-[#3474c0] text-white"
                    : "hover:bg-gray-50 text-gray-700"
                } ${isCollapsed ? "w-10 h-10" : "w-full justify-between"}`}
                title={isCollapsed ? category.name : undefined}
              >
                <span className="text-lg">
                  {getCategoryIcon(category.name)}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="font-medium flex-1 text-left ml-3">
                      {category.name}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        activeCategory === category.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {category.count || 0}
                    </span>
                  </>
                )}
              </button>
            ))}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Price Range Filter */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Price Range
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newRange: [number, number] = [
                      priceRange[0],
                      parseInt(e.target.value),
                    ];
                    setPriceRange(newRange);
                    onFiltersChange?.({
                      priceRange: newRange,
                      rating: selectedRating,
                      inStockOnly,
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3474c0 0%, #3474c0 ${
                      (priceRange[1] / 1000) * 100
                    }%, #e5e7eb ${
                      (priceRange[1] / 1000) * 100
                    }%, #e5e7eb 100%)`,
                  }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newRange: [number, number] = [
                      parseInt(e.target.value) || 0,
                      priceRange[1],
                    ];
                    setPriceRange(newRange);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3474c0]"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newRange: [number, number] = [
                      priceRange[0],
                      parseInt(e.target.value) || 1000,
                    ];
                    setPriceRange(newRange);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3474c0]"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Availability
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    onFiltersChange?.({
                      priceRange,
                      rating: selectedRating,
                      inStockOnly: e.target.checked,
                    });
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inStockOnly ? "bg-[#3474c0]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform transform ${
                      inStockOnly ? "translate-x-6" : "translate-x-0.5"
                    } mt-0.5`}
                  ></div>
                </div>
              </div>
              <span className="font-medium text-gray-700">In Stock Only</span>
            </label>
          </div>
        </>
      )}

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={clearAllFilters}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3474c0;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3474c0;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .sidebar-scroll::-webkit-scrollbar {
          display: none;
        }
        .sidebar-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
