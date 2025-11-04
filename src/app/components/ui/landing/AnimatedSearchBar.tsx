"use client";
import React, { useEffect, useRef } from "react";
import { useSearch } from "../../../contexts/SearchContext";

interface AnimatedSearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  isGlobal?: boolean; // indicates if this is the global search bar
}

const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  onFocus,
  onBlur,
  isGlobal = false,
}) => {
  const {
    isSearchActive,
    searchQuery,
    setSearchQuery,
    activateSearch,
    deactivateSearch,
    searchProducts,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // We use CSS transitions instead of Framer Motion. Styles are applied inline
  // so the element can smoothly move between the hero and top states.

  const handleInputFocus = () => {
    if (!isSearchActive) {
      // measure current position and width so the fixed state will align horizontally
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        const center = rect.left + rect.width / 2;
        document.documentElement.style.setProperty(
          "--search-center-x",
          `${center}px`
        );
        document.documentElement.style.setProperty(
          "--search-width",
          `${rect.width}px`
        );
      }
      activateSearch();
      onFocus?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!isSearchActive) {
      activateSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      deactivateSearch();
      inputRef.current?.blur();
      onBlur?.();
    }
  };

  // Focus the input when search becomes active
  useEffect(() => {
    if (isSearchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchActive]);

  // Inline style object that toggles between hero and top states.
  const containerStyle: React.CSSProperties = isSearchActive
    ? {
        position: "fixed",
        top: 20,
        // For global search, center on screen; for hero search, use measured position
        left: isGlobal ? "50%" : "var(--search-center-x, 50%)",
        transform: "translateX(-50%)",
        zIndex: 1002,
        width: isGlobal ? "90%" : "var(--search-width, 95%)",
        maxWidth: isGlobal ? "600px" : "unset",
        margin: 0,
        transition: isGlobal
          ? "none"
          : "top 320ms cubic-bezier(.2,.9,.2,1), opacity 220ms",
      }
    : {
        position: "relative",
        top: "auto",
        left: "auto",
        transform: "none",
        zIndex: 20,
        width: "100%",
        maxWidth: 512,
        margin: "0 auto",
        transition: isGlobal
          ? "none"
          : "top 420ms cubic-bezier(.2,.9,.2,1), opacity 220ms",
      };

  return (
    <div className="relative" ref={wrapperRef} style={containerStyle}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search Shopssentials"
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        className="w-full px-6 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#3474c0] text-sm md:text-base shadow-lg"
        aria-label="Search Shopssentials"
      />
    </div>
  );
};

export default AnimatedSearchBar;
