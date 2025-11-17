"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Product } from "../../hooks/useProducts";

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
}) => {
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasFetched, setHasFetched] = React.useState(false);
  const prevProductIdRef = React.useRef<string | undefined>(undefined);

  // Reset fetch state when product changes
  React.useEffect(() => {
    if (prevProductIdRef.current !== currentProductId) {
      setHasFetched(false);
      setLoading(true);
      setRelatedProducts([]);
      prevProductIdRef.current = currentProductId;
    }
  }, [currentProductId]);

  React.useEffect(() => {
    if (hasFetched || !currentProductId) return; // Prevent multiple fetches

    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get("/api/products?limit=5");
        const filtered = (response.data.products as Product[])
          .filter((p) => p.id !== currentProductId)
          .slice(0, 3);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, hasFetched]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No related products available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6">
        {relatedProducts.map((relatedProduct) => (
          <Link
            key={relatedProduct.id}
            href={`/product/${relatedProduct.id}`}
            className="flex-shrink-0 w-48 md:w-auto bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative bg-gray-100 rounded-t-lg overflow-hidden">
              <Image
                src={relatedProduct.image}
                alt={relatedProduct.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                {relatedProduct.name}
              </h3>
              <p className="text-[#3474c0] font-bold text-sm">
                {relatedProduct.price ? (
                  <>
                    <span className="text-base font-bold text-[#3474c0]">
                      {relatedProduct.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-1">
                      {relatedProduct.originalPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold text-[#3474c0]">
                    {relatedProduct.originalPrice}
                  </span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
