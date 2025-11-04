"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useProduct, Product } from "../../hooks/useProducts";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { usePaystack } from "../../hooks/usePaystack";
import { toast } from "react-toastify";
import CheckoutModal from "../../components/ui/landing/Modal/CheckoutModal";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

// Move components outside of ProductPage to prevent recreation on every render
function SuggestedProducts() {
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
    <div className="grid grid-cols-2 gap-4">
      {suggestedProducts.map((suggestedProduct) => (
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
function RelatedProducts({ currentProductId }: { currentProductId: string }) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedProducts.map((relatedProduct) => (
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
function ProductDisplay({ product }: { product: Product }) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [mainImageLoading, setMainImageLoading] = React.useState(true);
  const [thumbnailLoading, setThumbnailLoading] = React.useState(true);
  const [selectedQuantity, setSelectedQuantity] = React.useState(1);
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [animateModal, setAnimateModal] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const { addToCart, isLoading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  // Buy Now functionality with Paystack
  const { verifyPayment } = usePaystack({
    onSuccess: async (response) => {
      try {
        setIsProcessing(true);

        // Verify payment with Paystack
        const verification = await verifyPayment(response.reference);

        if (verification.success) {
          // Create order after successful payment
          await createDirectOrder(
            response.reference,
            verification.data.amount / 100
          );

          toast.success("Payment successful! Your order has been created.");
          handleCloseCheckoutModal();
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("Error processing payment. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    onClose: () => {
      if (!isProcessing) {
        toast.info("Payment cancelled.");
      }
    },
  });

  // Function to create order for direct purchase
  const createDirectOrder = async (
    paymentReference: string,
    paidAmount: number
  ) => {
    try {
      const orderItems = [
        {
          productId: product.id.toString(),
          quantity: selectedQuantity,
        },
      ];

      const response = await axios.post("/api/orders", {
        userId: user?.id,
        items: orderItems,
        paymentReference,
        totalAmount: paidAmount,
        storefront: "SHOPSSENTIALS",
      });

      if (response.data.success) {
        return response.data.order;
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  // Handle Buy Now click
  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to make a purchase");
      return;
    }

    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      // Clear cart and add this single item for checkout
      clearCart();

      // Add current product to cart for checkout modal
      const cartProduct = {
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        category: product.categoryName || product.category,
      };

      await addToCart(cartProduct, selectedQuantity);

      // Open checkout modal
      setShowCheckoutModal(true);
      setTimeout(() => setAnimateModal(true), 50);
    } catch (error) {
      console.error("Error initiating purchase:", error);
      toast.error("Error initiating purchase. Please try again.");
    }
  };

  // Handle closing checkout modal
  const handleCloseCheckoutModal = () => {
    setAnimateModal(false);
    setTimeout(() => setShowCheckoutModal(false), 300);
  };

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

  const handleAddToCart = async () => {
    try {
      // Transform product data to match CartContext Product interface
      const cartProduct = {
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        category: product.categoryName || product.category,
      };

      await addToCart(cartProduct, selectedQuantity);
      toast.success(`Added ${selectedQuantity} ${product.name} to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);

      // Check if it's an authentication error
      if (
        axios.isAxiosError(error) &&
        (error.message?.includes("Authentication required") ||
          error.response?.status === 401)
      ) {
        toast.error("You must be signed in to add items to your cart");
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
    }
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
                {mainImageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
                  </div>
                )}
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  onLoad={() => setMainImageLoading(false)}
                  onError={() => setMainImageLoading(false)}
                />
              </div>

              {/* Image Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((imageUrl: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square relative bg-white rounded-lg shadow-sm overflow-hidden border-2 ${
                        index === selectedImageIndex
                          ? "border-[#3474c0]"
                          : "border-gray-200 hover:border-gray-300"
                      } transition-colors`}
                    >
                      {thumbnailLoading && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
                        </div>
                      )}
                      <Image
                        src={imageUrl}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onLoad={() => {
                          // Set loading to false when any thumbnail loads
                          if (thumbnailLoading) setThumbnailLoading(false);
                        }}
                        onError={() => {
                          // Set loading to false on error
                          if (thumbnailLoading) setThumbnailLoading(false);
                        }}
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
                    value={selectedQuantity}
                    onChange={(e) =>
                      setSelectedQuantity(Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3474c0]"
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
                    onClick={handleBuyNow}
                    disabled={!product.inStock || isProcessing}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                      product.inStock && !isProcessing
                        ? "bg-[#3474c0] hover:bg-[#4f8bd6] text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : !product.inStock ? (
                      "Out of Stock"
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || !product.inStock}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cartLoading ? "Adding..." : "Add to Cart"}
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

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          handleClose={handleCloseCheckoutModal}
          animateModal={animateModal}
        />
      )}
    </div>
  );
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const [productId, setProductId] = React.useState<string>("");

  // Unwrap params promise
  React.useEffect(() => {
    params.then((p) => setProductId(p.productId));
  }, [params]);

  // Use the client-side hook for data fetching
  const { data: product, isLoading, error } = useProduct(productId);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3474c0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
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
                {!product
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
