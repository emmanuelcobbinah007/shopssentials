"use client";
import React, { useEffect } from "react";
import { useSearch } from "../../../contexts/SearchContext";
import AnimatedSearchBar from "./AnimatedSearchBar";
import SearchOverlay from "./SearchOverlay";
import SearchResults from "./SearchResults";

const GlobalSearch: React.FC = () => {
  const { isSearchActive } = useSearch();

  useEffect(() => {
    if (isSearchActive) {
      // Focus the search input when global search becomes active
      setTimeout(() => {
        const input = document.querySelector(
          'input[aria-label="Search Shopssentials"]'
        ) as HTMLInputElement | null;
        input?.focus();
      }, 100);
    }
  }, [isSearchActive]);

  if (!isSearchActive) return null;

  return (
    <>
      <SearchOverlay />
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[1001] w-full max-w-2xl px-4">
        <AnimatedSearchBar />
      </div>
      <SearchResults />
    </>
  );
};

export default GlobalSearch;
