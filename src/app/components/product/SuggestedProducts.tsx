"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Product } from "../../hooks/useProducts";

const SuggestedProducts: React.FC = () => {
  const [suggestedProducts, setSuggestedProducts] = React.useState<Product[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [hasFetched, setHasFetched] = React.useState(false);

  React.useEffect(() => {
    if (hasFetched) return; // Prevent multiple fetches

    const fetchSuggestedProducts = async () => {
      try {
        const response = await axios.get("/api/products?limit=4");
        setSuggestedProducts(response.data.products.slice(0, 4));
      } catch (err) {
        console.error("Error fetching suggested products:", err);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchSuggestedProducts();
  }, [hasFetched]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-3 animate-pulse"
          >
            <div className="aspect-square bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (suggestedProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 md:grid md:grid-cols-2 md:gap-4">
        {suggestedProducts.map((suggestedProduct) => (
          <Link
            key={suggestedProduct.id}
            href={`/product/${suggestedProduct.id}`}
            className="flex-shrink-0 w-40 md:w-auto bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-2"
          >
            <div className="aspect-square relative bg-gray-100 rounded mb-2 overflow-hidden">
              <Image
                src={suggestedProduct.image}
                alt={suggestedProduct.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-medium text-xs text-gray-900 line-clamp-2 mb-1">
              {suggestedProduct.name}
            </h3>
            <p className="text-[#3474c0] font-bold text-xs">
              {suggestedProduct.price ? (
                <>
                  <span className="text-sm font-bold text-[#3474c0]">
                    {suggestedProduct.price}
                  </span>
                  <span className="text-xs text-gray-500 line-through ml-1">
                    {suggestedProduct.originalPrice}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-[#3474c0]">
                  {suggestedProduct.originalPrice}
                </span>
              )}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
