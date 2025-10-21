import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock products data - in a real app, this would come from an API or database
const products = [
  {
    id: 1,
    name: "Professional Shelving Unit",
    price: "GHS299",
    image: "/images/product1.jpeg",
    description:
      "Heavy-duty steel shelving for maximum storage capacity. Perfect for retail stores, warehouses, and commercial spaces. Features adjustable shelves and powder-coated finish for durability.",
    features: [
      "Heavy-duty steel construction",
      "Adjustable shelf heights",
      "Powder-coated finish",
      "Maximum load capacity: 500kg per shelf",
      "Easy assembly with included hardware",
    ],
    category: "Shelving",
    inStock: true,
    rating: 4.5,
    reviews: 23,
  },
  {
    id: 2,
    name: "Retail Display Stand",
    price: "GHS159",
    image: "/images/product2.jpg",
    description:
      "Eye-catching display stand to showcase your best products. Modern design with tempered glass shelves and aluminum frame. Perfect for jewelry, cosmetics, or high-value items.",
    features: [
      "Tempered glass shelves",
      "Aluminum frame construction",
      "LED lighting option available",
      "Rotating base for 360° viewing",
      "Multiple size configurations",
    ],
    category: "Displays",
    inStock: true,
    rating: 4.2,
    reviews: 15,
  },
  {
    id: 3,
    name: "POS System Bundle",
    price: "GHS449",
    image: "/images/product3.jpg",
    description:
      "Complete point-of-sale system with thermal receipt printer, barcode scanner, and cash drawer. Includes POS software license and 1-year warranty.",
    features: [
      "Thermal receipt printer included",
      "Barcode scanner compatible",
      "Cash drawer with lock",
      "Touchscreen POS software",
      "1-year warranty and support",
    ],
    category: "POS Systems",
    inStock: false,
    rating: 4.8,
    reviews: 31,
  },
  {
    id: 4,
    name: "Shopping Baskets Set",
    price: "GHS89",
    image: "/images/product4.jpg",
    description:
      "Durable plastic baskets for customer convenience. Set of 6 stackable baskets with comfortable handles. Perfect for retail stores and supermarkets.",
    features: [
      "Set of 6 durable plastic baskets",
      "Comfortable carrying handles",
      "Stackable for easy storage",
      "Food-safe plastic material",
      "Available in multiple colors",
    ],
    category: "Accessories",
    inStock: true,
    rating: 4.0,
    reviews: 8,
  },
];

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const { productId } = await params;
  const productIdNum = parseInt(productId);
  const product = products.find((p) => p.id === productIdNum);

  if (!product) {
    notFound();
  }

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
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-white rounded-lg shadow-sm overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Additional images could go here */}
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
                  <span className="font-medium">{product.category}</span>
                </div>
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
                </div>
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
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#3474c0] mt-1">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products Section could go here */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products
                .filter((p) => p.id !== product.id)
                .slice(0, 3)
                .map((relatedProduct) => (
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
                      <p className="text-[#3474c0] font-bold">
                        {relatedProduct.price}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
