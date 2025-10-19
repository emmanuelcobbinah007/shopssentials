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
      <div className="fixed top-4 left-0 right-0 z-[1001] flex justify-center px-4">
        <AnimatedSearchBar isGlobal={true} />
      </div>
      <SearchResults />
    </>
  );
};

export default GlobalSearch;
