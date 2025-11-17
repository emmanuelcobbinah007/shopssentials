"use client";

import React from "react";
import Link from "next/link";
import SuggestedProducts from "./SuggestedProducts";

const ProductNotFound: React.FC = () => {
  return (
    <div>
      <div className="h-24"></div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/shop"
              className="inline-block w-full bg-[#3474c0] hover:bg-[#4f8bd6] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              href="/"
              className="inline-block w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>

          {/* Suggested products */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              You might be interested in
            </h2>
            <SuggestedProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductNotFound;
