"use client";
import React, { useState } from "react";

interface SidebarProps {
  onCategoryChange?: (category: string) => void;
  onFiltersChange?: (filters: any) => void;
}

const categories = [
  {
    id: "all",
    name: "All Products",
    icon: (
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
    ),
    count: 124,
  },
  {
    id: "shelving",
    name: "Shelving",
    icon: (
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
    count: 45,
  },
  {
    id: "displays",
    name: "Displays",
    icon: (
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
    count: 28,
  },
  {
    id: "pos",
    name: "POS Systems",
    icon: (
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
    count: 12,
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: (
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
    count: 39,
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  onCategoryChange,
  onFiltersChange,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
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

  const renderStars = (rating: number, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onClick?.(star)}
            className={`text-lg ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${onClick ? "hover:text-yellow-300 cursor-pointer" : ""}`}
            disabled={!onClick}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen overflow-y-auto sidebar-scroll transition-all duration-300 ${
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
          {categories.map((category) => (
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
              <span className="text-lg">{category.icon}</span>
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
                    {category.count}
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
                    const newRange = [priceRange[0], parseInt(e.target.value)];
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
                    const newRange = [
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
                    const newRange = [
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
