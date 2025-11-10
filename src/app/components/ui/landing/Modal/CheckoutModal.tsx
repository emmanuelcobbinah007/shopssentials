import React, { useState } from "react";
import { CloseCircle } from "iconsax-reactjs";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { usePaystack, toKobo } from "@/app/hooks/usePaystack";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";

interface CheckoutModalProps {
  handleClose: () => void;
  animateModal: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  handleClose,
  animateModal,
}) => {
  const { user } = useAuth();
  const { items, total, itemCount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
  });

  // Keep shippingInfo in sync with authenticated user when it becomes available.
  React.useEffect(() => {
    console.log("CheckoutModal: user changed:", user);
    if (!user) return;

    console.log("CheckoutModal: user.phone =", user.phone);
    console.log("CheckoutModal: user.phone type =", typeof user.phone);
    console.log("CheckoutModal: user =", JSON.stringify(user, null, 2));

    setShippingInfo((prev) => {
      const updated = {
        firstName: user.firstname || prev.firstName,
        lastName: user.lastname || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || "",
        address: prev.address,
        city: prev.city,
        region: prev.region,
        postalCode: prev.postalCode,
      };
      console.log("CheckoutModal: updating shippingInfo to:", updated);
      return updated;
    });
  }, [user]);

  const {
    initializePayment,
    generateReference,
    verifyPayment,
    isPaystackReady,
  } = usePaystack({
    onSuccess: async (response) => {
      try {
        setIsProcessing(true);

        // Verify payment with Paystack
        const verification = await verifyPayment(response.reference);

        if (verification.success) {
          // Create order after successful payment
          await createOrder(response.reference, verification.data.amount / 100);

          toast.success("Payment successful! Your order has been created.");
          await clearCart(); // Clear cart after successful order
          handleClose();
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

  // Function to create order after successful payment
  const createOrder = async (paymentReference: string, paidAmount: number) => {
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id.toString(),
        quantity: item.quantity,
      }));

      const response = await axios.post("/api/orders", {
        userId: user?.id,
        items: orderItems,
        shippingInfo,
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

  // Validate form before proceeding with payment
  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "region",
    ];

    for (const field of requiredFields) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to complete your order");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const reference = generateReference();
      const amountInKobo = toKobo(total);

      initializePayment({
        email: shippingInfo.email,
        amount: amountInKobo,
        currency: "GHS",
        reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: shippingInfo.phone,
            },
            {
              display_name: "Order Items",
              variable_name: "order_items",
              value: `${itemCount} items`,
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Error initializing payment. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPrice = (price: string | number) => {
    const numPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[₵GHS,\s]/g, ""))
        : price;
    return `₵${numPrice.toLocaleString("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex font-poppins">
      {/* Overlay */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${
          animateModal
            ? "bg-[#D5E8FA]/30 backdrop-blur-sm"
            : "bg-transparent backdrop-blur-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`fixed right-0 top-0 h-full bg-white w-[400px] md:w-[450px] shadow-lg overflow-y-auto z-10 transform transition-transform duration-300 ease-in-out ${
          animateModal ? "translate-x-0 opacity-100" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6 p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#3474c0]">Checkout</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-200 transition duration-200"
            aria-label="Close"
          >
            <CloseCircle color="#3474c0" size={24} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary ({itemCount} items)
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(
                      parseFloat(item.product.price.replace(/[₵GHS,\s]/g, "")) *
                        item.quantity
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-[#3474c0]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckout();
            }}
          >
            {/* Shipping Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Shipping Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                    placeholder="Street address, apartment, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={shippingInfo.region}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Secure Payment with Paystack
                    </p>
                    <p className="text-xs text-blue-600">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleCheckout();
              }}
              disabled={isProcessing || items.length === 0 || !isPaystackReady}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isProcessing || items.length === 0 || !isPaystackReady
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[#3474c0] text-white hover:bg-[#2a5a9e]"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : !isPaystackReady ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                  Loading Payment System...
                </div>
              ) : (
                `Pay Now - ${formatPrice(total)}`
              )}
            </button>
          </form>

          <button
            onClick={handleClose}
            className="w-full mt-3 border border-[#3474c0] text-[#3474c0] py-3 rounded-lg font-semibold hover:bg-[#3474c0] hover:text-white transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
