"use client";
import React from "react";
import { useSearch } from "../../../contexts/SearchContext";

const SearchOverlay: React.FC = () => {
  const { isSearchActive, deactivateSearch } = useSearch();

  if (!isSearchActive) return null;

  return (
    <div
      className="fixed inset-0 bg-[#D5E8FA]/30 backdrop-blur-sm z-[999] transition-opacity duration-300"
      onClick={() => deactivateSearch()}
      aria-hidden="true"
    />
  );
};

export default SearchOverlay;
