import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CloseCircle, Add, Minus, Trash } from "iconsax-reactjs";
import { useCart, CartItem } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface CartModalProps {
  handleClose: () => void;
  animateModal: boolean;
  onOpenUserModal?: () => void;
}

interface CartModalProps {
  handleClose: () => void;
  animateModal: boolean;
}

const CartModal: React.FC<CartModalProps> = ({
  handleClose,
  animateModal,
  onOpenUserModal,
}) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    items,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
    loadUserCart,
    isLoading: cartLoading,
  } = useCart();
  const router = useRouter();
  const [cartInitialized, setCartInitialized] = useState(false);

  // Initialize cart when modal opens and user is authenticated
  useEffect(() => {
    if (animateModal && isAuthenticated && user && !cartInitialized) {
      loadUserCart(user.id);
      setCartInitialized(true);
    }
  }, [animateModal, isAuthenticated, user, cartInitialized, loadUserCart]);

  // Reset cart initialization when modal closes
  useEffect(() => {
    if (!animateModal) {
      setCartInitialized(false);
    }
  }, [animateModal]);

  const formatPrice = (price: string) => {
    return price;
  };

  const LoginPrompt = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Login to view your cart
      </h3>
      <p className="text-gray-500 mb-6">
        Sign in to access your shopping cart and checkout
      </p>
      <button
        onClick={() => {
          handleClose();
          if (onOpenUserModal) {
            onOpenUserModal();
          }
        }}
        className="bg-[#3474c0] text-white px-6 py-2 rounded-lg hover:bg-[#2a5a9e] transition-colors"
      >
        Sign In
      </button>
    </div>
  );

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Your cart is empty
      </h3>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <button
        onClick={() => {
          handleClose();
          router.push("/shop");
        }}
        className="bg-[#3474c0] text-white px-6 py-2 rounded-lg hover:bg-[#2a5a9e] transition-colors"
      >
        Shop Now
      </button>
    </div>
  );

  const CartItem = ({ item }: { item: CartItem }) => (
    <div className="flex items-center gap-3 py-4 border-b border-gray-100 last:border-b-0">
      <Image
        src={item.product.image}
        alt={item.product.name}
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.product.name}
        </h4>
        <p className="text-sm text-gray-500">
          {formatPrice(item.product.price)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={async () =>
            await updateQuantity(item.product.id, item.quantity - 1)
          }
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Minus size={12} color="#666" />
        </button>
        <span className="text-sm font-medium w-6 text-center">
          {item.quantity}
        </span>
        <button
          onClick={async () =>
            await updateQuantity(item.product.id, item.quantity + 1)
          }
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Add size={12} color="#666" />
        </button>
      </div>
      <button
        onClick={async () => await removeFromCart(item.product.id)}
        className="p-1 rounded-full hover:bg-red-50 transition-colors ml-2"
      >
        <Trash size={16} color="#ef4444" />
      </button>
    </div>
  );

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex font-poppins">
        <div
          className="fixed inset-0 bg-[#D5E8FA]/30 backdrop-blur-sm"
          onClick={handleClose}
        ></div>
        <div className="fixed right-0 top-0 h-full bg-white w-[350px] md:w-[400px] shadow-lg p-6 overflow-y-auto z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3474c0] mx-auto mb-2"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[60] flex font-poppins">
        <div
          className={`fixed inset-0 transition-opacity duration-300 ${
            animateModal
              ? "bg-[#D5E8FA]/30 backdrop-blur-sm"
              : "bg-transparent backdrop-blur-0"
          }`}
          onClick={handleClose}
        ></div>
        <div
          className={`fixed right-0 top-0 h-full bg-white w-[350px] md:w-[400px] shadow-lg p-6 overflow-y-auto z-10 transform transition-transform duration-300 ease-in-out ${
            animateModal ? "translate-x-0 opacity-100" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4 w-full">
            <h2 className="text-xl font-semibold text-[#3474c0] flex-1 text-left">
              Your Cart
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-200 transition duration-200"
              aria-label="Close"
            >
              <CloseCircle color="#3474c0" size={24} />
            </button>
          </div>
          <LoginPrompt />
        </div>
      </div>
    );
  }

  // Show loading state while fetching cart
  if (cartLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex font-poppins">
        <div
          className={`fixed inset-0 transition-opacity duration-300 ${
            animateModal
              ? "bg-[#D5E8FA]/30 backdrop-blur-sm"
              : "bg-transparent backdrop-blur-0"
          }`}
          onClick={handleClose}
        ></div>
        <div
          className={`fixed right-0 top-0 h-full bg-white w-[350px] md:w-[400px] shadow-lg p-6 overflow-y-auto z-10 transform transition-transform duration-300 ease-in-out ${
            animateModal ? "translate-x-0 opacity-100" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4 w-full">
            <h2 className="text-xl font-semibold text-[#3474c0] flex-1 text-left">
              Your Cart ({itemCount})
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-200 transition duration-200"
              aria-label="Close"
            >
              <CloseCircle color="#3474c0" size={24} />
            </button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3474c0] mx-auto mb-2"></div>
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full bg-white w-[350px] md:w-[400px] shadow-lg p-6 overflow-y-auto z-10 transform transition-transform duration-300 ease-in-out ${
          animateModal ? "translate-x-0 opacity-100" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4 w-full">
          <h2 className="text-xl font-semibold text-[#3474c0] flex-1 text-left">
            Your Cart ({itemCount})
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-200 transition duration-200"
            aria-label="Close"
          >
            <CloseCircle color="#3474c0" size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 mb-6">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Cart Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-xl font-bold text-[#3474c0]">
                  ₵
                  {total.toLocaleString("en-GH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-[#3474c0] text-white py-3 rounded-lg font-semibold hover:bg-[#2a5a9e] transition-colors mb-3">
              Proceed to Checkout
            </button>

            <button
              onClick={handleClose}
              className="w-full border border-[#3474c0] text-[#3474c0] py-3 rounded-lg font-semibold hover:bg-[#3474c0] hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
