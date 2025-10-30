"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

// Component for suggested products in not found state
async function SuggestedProducts() {
  let suggestedProducts = [];

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products?limit=4`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      suggestedProducts = data.products.slice(0, 4);
    }
  } catch (err) {
    console.error("Error fetching suggested products:", err);
  }

  if (suggestedProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {suggestedProducts.map((suggestedProduct: any) => (
        <Link
          key={suggestedProduct.id}
          href={`/product/${suggestedProduct.id}`}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3"
        >
          <div className="aspect-square relative bg-gray-100 rounded mb-2 overflow-hidden">
            <Image
              src={suggestedProduct.image}
              alt={suggestedProduct.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
            {suggestedProduct.name}
          </h3>
          <p className="text-[#3474c0] font-bold text-sm">
            {suggestedProduct.price}
          </p>
        </Link>
      ))}
    </div>
  );
}

// Component for related products
async function RelatedProducts({
  currentProductId,
}: {
  currentProductId: string;
}) {
  let relatedProducts = [];

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products?limit=3`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      relatedProducts = data.products
        .filter((p: any) => p.id !== currentProductId)
        .slice(0, 3);
    }
  } catch (err) {
    console.error("Error fetching related products:", err);
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No related products available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedProducts.map((relatedProduct: any) => (
        <Link
          key={relatedProduct.id}
          href={`/product/${relatedProduct.id}`}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-square relative bg-gray-100 rounded-t-lg overflow-hidden">
            <Image
              src={relatedProduct.image}
              alt={relatedProduct.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {relatedProduct.name}
            </h3>
            <p className="text-[#3474c0] font-bold">{relatedProduct.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Client component for product display with image gallery
function ProductDisplay({ product }: { product: any }) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-lg ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            disabled
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating} ({product.reviews} reviews)
        </span>
      </div>
    );
  };

  return (
    <div>
      <div className="h-24"></div>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#3474c0]">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-[#3474c0]">
                Products
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-white rounded-lg shadow-sm overflow-hidden">
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Image Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((imageUrl: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square relative bg-white rounded-lg shadow-sm overflow-hidden border-2 ${
                        index === selectedImageIndex
                          ? "border-[#3474c0]"
                          : "border-gray-200 hover:border-gray-300"
                      } transition-colors`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  {renderStars(product.rating)}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Category:{" "}
                  <span className="font-medium">
                    {product.categoryName || product.category}
                  </span>
                </div>
                {product.subCategoryName && (
                  <div className="text-sm text-gray-600 mb-2">
                    Sub-category:{" "}
                    <span className="font-medium">
                      {product.subCategoryName}
                    </span>
                  </div>
                )}
                <div
                  className={`text-sm font-medium ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#3474c0]">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                {product.isOnSale && (
                  <div className="mt-2">
                    <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {product.salePercent}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="quantity"
                    className="font-medium text-gray-900"
                  >
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3474c0]"
                    defaultValue="1"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                      product.inStock
                        ? "bg-[#3474c0] hover:bg-[#4f8bd6] text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    Add to Wishlist
                  </button>
                </div>
              </div>

              {/* Product Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Features */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {Array.isArray(product.features) &&
                    product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-[#3474c0] mt-1">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              You might also like
            </h2>
            <RelatedProducts currentProductId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const { productId } = await params;

  // Fetch product from API
  let product = null;
  let error = null;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products/${productId}`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );

    if (response.ok) {
      const data = await response.json();
      product = data.product;
    } else if (response.status === 404) {
      error = "Product not found";
    } else {
      error = "Failed to load product";
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    error = "Failed to load product";
  }

  // If there's an error or product not found, show beautiful not found state
  if (error || !product) {
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
                {error === "Product not found"
                  ? "The product you're looking for doesn't exist or has been removed."
                  : "We couldn't load this product right now. Please try again later."}
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
  }

  return <ProductDisplay product={product} />;
};

export default ProductPage;
