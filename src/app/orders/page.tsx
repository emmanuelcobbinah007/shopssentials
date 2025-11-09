"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCart, CalendarTick, Box, ArrowLeft } from "iconsax-reactjs";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReviewModal from "../components/ui/ReviewModal";

interface OrderItem {
  id: string;
  quantity: number;
  size?: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
    category: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
  total: number;
  itemCount: number;
  hasReviewed?: boolean;
}

const formatOrderStatus = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "PROCESSING":
      return "Processing";
    case "PENDING":
      return "Pending";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Processing";
  }
};

const getStatusColorClasses = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const OrdersContent: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/orders?userId=${user.id}&storefront=SHOPSSENTIALS`
      );

      if (response.data.success) {
        const ordersWithReviewStatus = await Promise.all(
          response.data.orders.map(async (order: Order) => {
            if (order.status === "COMPLETED") {
              try {
                const token =
                  localStorage.getItem("token") ||
                  localStorage.getItem("accessToken");
                const reviewResponse = await axios.get(
                  `/api/reviews/check?orderId=${order.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                return {
                  ...order,
                  hasReviewed: reviewResponse.data.hasReviewedAll,
                };
              } catch (error) {
                console.error("Error checking review status:", error);
                return { ...order, hasReviewed: false };
              }
            }
            return order;
          })
        );
        setOrders(ordersWithReviewStatus);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleReviewOrder = (order: Order) => {
    setReviewModalOrder(order);
  };

  const handleReviewsSubmitted = () => {
    fetchOrders(); // Refresh orders to update review status
  };

  const handleReorderItems = (order: Order) => {
    // If multiple items, go to shop page
    if (order.orderItems.length > 1) {
      toast.info("Redirecting to shop page to reorder multiple items");
      router.push("/shop");
    } else {
      // If single item, go directly to that product page
      const productId = order.orderItems[0].product.id;
      router.push(`/product/${productId}`);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    // Only fetch orders if user is authenticated
    if (isAuthenticated && user) {
      fetchOrders();
    } else {
      // If not authenticated, just set loading to false
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading, fetchOrders]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3474c0] mb-4"></div>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="py-[30px] md:py-[45px] bg-white"></div>

        <div className="w-[90%] md:w-[85%] mx-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className={`md:text-3xl text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#3474c0] via-[#4fb3e5] to-[#3474c0] drop-shadow-lg tracking-tight`}
            >
              My Orders
            </h1>
            <p className="text-gray-600">
              View your order history and track your purchases
            </p>
          </div>

          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Please log in to view your orders
            </h2>
            <p className="text-gray-600 mb-6">
              Use the sign in button in the navigation bar to access your order
              history
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#3474c0] text-white rounded-lg hover:bg-[#2a5a9e] transition-colors duration-200 font-medium"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="py-[30px] md:py-[45px] bg-white"></div>

      <div className="w-[90%] md:w-[85%] mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`md:text-3xl text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#3474c0] via-[#4fb3e5] to-[#3474c0] drop-shadow-lg tracking-tight`}
          >
            My Orders
          </h1>
          <p className="text-gray-600">
            View your order history and track your purchases
          </p>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders. Start shopping now!
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-[#3474c0] text-white rounded-lg hover:bg-[#2a5a9e] transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClasses(
                          order.status
                        )}`}
                      >
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={
                              item.product.images?.[0]?.url ||
                              "/placeholder-image.jpg"
                            }
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            {item.size && (
                              <p className="text-sm text-gray-500">
                                Size: {item.size}
                              </p>
                            )}
                            <p className="text-sm font-semibold text-gray-900">
                              ₵{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Total (
                        {order.orderItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        items)
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₵
                        {order.orderItems
                          .reduce(
                            (sum, item) =>
                              sum + item.product.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons for Completed Orders */}
                  {order.status === "COMPLETED" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleReorderItems(order)}
                          className="flex-1 px-4 py-2 bg-[#3474c0] text-white rounded-lg hover:bg-[#2a5a9e] transition-colors duration-200 font-medium"
                        >
                          Reorder Items
                        </button>
                        {order.hasReviewed ? (
                          <div className="flex-1 px-4 py-2 border-2 border-green-200 text-green-700 bg-green-50 rounded-lg font-medium text-center">
                            ✓ Reviews Submitted
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReviewOrder(order)}
                            className="flex-1 px-4 py-2 border-2 border-[#3474c0] text-[#3474c0] rounded-lg hover:bg-[#3474c0] hover:text-white transition-colors duration-200 font-medium"
                          >
                            Leave a Review
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Processing Status Message */}
                  {order.status !== "COMPLETED" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-[#3474c0]">
                        <span className="text-sm font-medium">
                          Your order is{" "}
                          {formatOrderStatus(order.status).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOrder && (
        <ReviewModal
          order={reviewModalOrder}
          isOpen={!!reviewModalOrder}
          onClose={() => setReviewModalOrder(null)}
          onReviewsSubmitted={handleReviewsSubmitted}
        />
      )}
    </div>
  );
};

const OrdersPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3474c0] mb-4"></div>
          </div>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
};

export default OrdersPage;
