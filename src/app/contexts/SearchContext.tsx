"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface SearchState {
  isSearchActive: boolean;
  searchQuery: string;
  searchResults: Product[];
  isLoading: boolean;
  searchPosition: "hero" | "top";
}

interface SearchContextType extends SearchState {
  setIsSearchActive: (active: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Product[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSearchPosition: (position: "hero" | "top") => void;
  activateSearch: () => void;
  deactivateSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPosition, setSearchPosition] = useState<"hero" | "top">("hero");

  const activateSearch = () => {
    setIsSearchActive(true);
    setSearchPosition("top");
  };

  const deactivateSearch = () => {
    setIsSearchActive(false);
    setSearchPosition("hero");
    setSearchQuery("");
    setSearchResults([]);
  };

  const value: SearchContextType = {
    isSearchActive,
    searchQuery,
    searchResults,
    isLoading,
    searchPosition,
    setIsSearchActive,
    setSearchQuery,
    setSearchResults,
    setIsLoading,
    setSearchPosition,
    activateSearch,
    deactivateSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
