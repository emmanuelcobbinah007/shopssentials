"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCart, CalendarTick, Box, ArrowLeft } from "iconsax-reactjs";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  isCompleted: boolean;
  createdAt: string;
  orderItems: OrderItem[];
  total: number;
  itemCount: number;
}

const formatOrderStatus = (isCompleted: boolean) => {
  return isCompleted ? "Completed" : "Processing";
};

const getStatusColorClasses = (isCompleted: boolean) => {
  return isCompleted
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
};

const OrdersContent: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/orders?userId=${user.id}&storefront=SHOPSSENTIALS`
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, isAuthenticated, authLoading, fetchOrders, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3474c0] mb-4"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Please log in to view your orders
          </h2>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#3474c0] text-white rounded-lg hover:bg-[#2a5a9e] transition-colors duration-200"
          >
            Go to Homepage
          </Link>
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
                          order.isCompleted
                        )}`}
                      >
                        {formatOrderStatus(order.isCompleted)}
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
                  {order.isCompleted && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 px-4 py-2 bg-[#3474c0] text-white rounded-lg hover:bg-[#2a5a9e] transition-colors duration-200 font-medium">
                          Reorder Items
                        </button>
                        <button className="flex-1 px-4 py-2 border-2 border-[#3474c0] text-[#3474c0] rounded-lg hover:bg-[#3474c0] hover:text-white transition-colors duration-200 font-medium">
                          Leave a Review
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Processing Status Message */}
                  {!order.isCompleted && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-[#3474c0]">
                        <span className="text-sm font-medium">
                          Your order is being processed
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
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
};

export default OrdersPage;
