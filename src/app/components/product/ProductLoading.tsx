"use client";

import React from "react";

const ProductLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3474c0] mx-auto mb-4"></div>
      </div>
    </div>
  );
};

export default ProductLoading;
