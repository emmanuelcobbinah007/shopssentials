"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isOnSale: boolean;
  categoryId: string;
  subCategoryId?: string;
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
  searchProducts: (query: string) => Promise<void>;
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

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/products?search=${encodeURIComponent(query)}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    searchProducts,
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
