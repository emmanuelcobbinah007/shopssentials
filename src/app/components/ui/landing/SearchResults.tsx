"use client";
import React, { useEffect, useState } from "react";
import { useSearch } from "../../../contexts/SearchContext";
import Image from "next/image";
import Link from "next/link";

const SearchResults: React.FC = () => {
  const {
    isSearchActive,
    searchQuery,
    searchResults,
    isLoading,
    searchProducts,
    deactivateSearch,
  } = useSearch();

  // local visibility for CSS enter/exit animation
  const [visible, setVisible] = useState(false);
  // mounted keeps the component in the DOM while the exit animation runs
  const [mounted, setMounted] = useState(false);

  // Real search with debounce
  useEffect(() => {
    if (searchQuery && isSearchActive) {
      const timeoutId = setTimeout(() => {
        searchProducts(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }

    if (!searchQuery) {
      // Clear results when query is empty, but don't set loading
      searchProducts("");
    }
  }, [searchQuery, isSearchActive]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const ANIM_MS = 300; // must match CSS transition duration

    if (isSearchActive) {
      setMounted(true);
      t = setTimeout(() => setVisible(true), 10);
    } else {
      // trigger exit animation
      setVisible(false);
      // unmount after animation finishes
      t = setTimeout(() => setMounted(false), ANIM_MS);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [isSearchActive]);

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed mt-4 z-[1001] transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      // align horizontally to the measured search bar center and width
      style={{
        left: "var(--search-center-x, 50%)",
        transform: "translateX(-50%)",
        width: "var(--search-width, 90%)",
        maxWidth: "640px",
        top: visible ? 80 : 64,
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-96 overflow-hidden">
        {/* Loading state (only when user has typed) or prompt when empty */}
        {isLoading && searchQuery && (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[#3474c0] border-t-transparent rounded-full mx-auto animate-spin" />
            <p className="text-gray-500 mt-2">Searching...</p>
          </div>
        )}

        {!searchQuery && (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              Start typing to search Shopssentials
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try keywords like “shelves”, “POS”, or “displays”.
            </p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No products found for &quot;{searchQuery}&quot;
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try different keywords or browse our categories
            </p>
          </div>
        )}

        {/* Results List */}
        {!isLoading && searchResults.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={deactivateSearch}
                className="block p-4 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#1A1D23] text-sm">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 capitalize">
                        {product.category.replace("-", " ")}
                      </span>
                      {!product.inStock && (
                        <span className="text-xs text-red-500">
                          Out of Stock
                        </span>
                      )}
                      {product.isOnSale && (
                        <span className="text-xs text-green-600">On Sale</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#3474c0] font-semibold text-sm">
                      {product.price}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        {product.originalPrice}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {searchQuery && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-2 flex-wrap">
              <Link
                href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                onClick={deactivateSearch}
                className="px-3 py-1 bg-[#3474c0] text-white text-xs rounded-full hover:bg-[#4f8bd6] transition-colors"
              >
                View All Results
              </Link>
              <Link
                href="/shop"
                onClick={deactivateSearch}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-50 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
