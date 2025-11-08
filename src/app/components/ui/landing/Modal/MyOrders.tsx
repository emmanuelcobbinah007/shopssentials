import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { ShoppingCart, CalendarTick, Box, ArrowLeft } from "iconsax-reactjs";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

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

interface MyOrdersProps {
  onBack: () => void;
  onCloseModal?: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ onBack, onCloseModal }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/orders?userId=${user?.id}&storefront=SHOPSSENTIALS`
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
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return `₵${price.toLocaleString("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3474c0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Order #{selectedOrder.id.slice(-8)}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">Order Details</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedOrder.isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {selectedOrder.isCompleted ? "Completed" : "Processing"}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Ordered on {formatDate(selectedOrder.createdAt)}
          </p>
          <p className="text-sm font-medium text-gray-900 mt-2">
            Total: {formatPrice(selectedOrder.total)}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Items Ordered</h4>
          {selectedOrder.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {item.product.images && item.product.images.length > 0 ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Box size={24} color="#6B7280" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 truncate">
                  {item.product.name}
                </h5>
                <p className="text-sm text-gray-600">
                  {item.product.category.name}
                </p>
                {item.size && (
                  <p className="text-xs text-gray-500">Size: {item.size}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(item.product.price)}
                </p>
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} color="#6B7280" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-600 mb-4">
            You haven&apos;t placed any orders yet. Start shopping to see your
            order history here!
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Link
              href="/orders"
              onClick={onCloseModal}
              className="text-sm text-[#3474c0] hover:text-[#2a5a9e]"
            >
              <p>View all orders</p>
            </Link>
            <span className="text-sm text-gray-600">
              {orders.length} orders
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarTick size={16} color="#3474c0" />
                    <span className="text-sm font-medium text-gray-900">
                      Order #{order.id.slice(-8)}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.isCompleted
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.isCompleted ? "Completed" : "Processing"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{formatDate(order.createdAt)}</span>
                  <span>{order.itemCount} items</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                  <span className="text-sm text-[#3474c0] hover:text-[#2a5a9e]">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
