"use client";
import React from "react";
import { useSearch } from "../../../contexts/SearchContext";

const FixedSearchButton: React.FC = () => {
  const { isSearchActive, activateSearch } = useSearch();

  const handleClick = () => {
    if (!isSearchActive) {
      activateSearch();
      // GlobalSearch component will handle focusing the input
    } else {
      // already active - focus input
      const main = document.querySelector(
        'input[aria-label="Search Shopssentials"]'
      ) as HTMLInputElement | null;
      main?.focus();
    }
  };

  // hide the fixed button while the search is active
  if (isSearchActive) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Open search"
      title="Search"
      className="fixed bottom-6 right-6 z-[1100] w-12 h-12 rounded-full bg-[#3474c0] text-white shadow-lg flex items-center justify-center hover:bg-[#4f8bd6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3474c0]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>
    </button>
  );
};

export default FixedSearchButton;
