import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  description: string;
  shortDescription?: string;
  category: string;
  categoryName?: string;
  subCategoryName?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isOnSale: boolean;
  categoryId: string;
  subCategoryId?: string;
  stock?: number;
  salePercent?: number;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  count?: number;
  imageURL?: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

interface ProductsFilters {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: string;
}

// Fetch all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await axios.get("/api/categories");
      return response.data.categories;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Fetch products with filters
export const useProducts = (filters: ProductsFilters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async (): Promise<{ products: Product[]; total: number }> => {
      const params = new URLSearchParams();

      if (filters.categoryId && filters.categoryId !== "all") {
        params.append("categoryId", filters.categoryId);
      }
      if (filters.subCategoryId && filters.subCategoryId !== "all") {
        params.append("subCategoryId", filters.subCategoryId);
      }
      if (filters.minPrice && filters.minPrice > 0) {
        params.append("minPrice", filters.minPrice.toString());
      }
      if (filters.maxPrice && filters.maxPrice < 10000) {
        params.append("maxPrice", filters.maxPrice.toString());
      }
      if (filters.inStock) {
        params.append("inStock", "true");
      }
      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
      }

      const response = await axios.get(`/api/products?${params}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch single product
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<Product> => {
      const response = await axios.get(`/api/products/${productId}`);
      return response.data.product;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
