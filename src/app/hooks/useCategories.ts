import { useState, useEffect } from "react";

export interface Category {
  id: string;
  name: string;
  count: number;
  imageURL: string;
  subCategories: {
    id: string;
    name: string;
  }[];
}

export interface CategoriesResponse {
  categories: Category[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: CategoriesResponse = await response.json();
        setCategories(data.categories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
