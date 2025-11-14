"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  loadUserCart: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart when user logs in
  useEffect(() => {
    console.log("CartContext useEffect triggered:", {
      isAuthenticated,
      user: !!user,
      itemsLength: items.length,
    });
    if (isAuthenticated && user && items.length === 0) {
      console.log("Loading cart in CartContext for user:", user.id);
      loadUserCart(user.id);
    }
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate total price
  const total = items.reduce((sum, item) => {
    const priceString = item.product.price
      .replace("GHS", "")
      .replace("₵", "")
      .replace(",", "");
    const price = parseFloat(priceString);
    return sum + price * item.quantity;
  }, 0);

  // Calculate total item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!isAuthenticated || !user) {
      throw new Error(
        "Authentication required. Please log in to add items to your cart."
      );
    }

    // Optimistic update - update local state immediately
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });

    // Persist to database
    axios
      .post("/api/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity,
      })
      .catch((error) => {
        console.error("Failed to save cart item to database:", error);
        // Revert the optimistic update
        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // If it was existing, subtract the quantity
            const newQuantity = existingItem.quantity - quantity;
            if (newQuantity <= 0) {
              return prevItems.filter((item) => item.product.id !== product.id);
            } else {
              return prevItems.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              );
            }
          } else {
            // If it was new, remove it
            return prevItems.filter((item) => item.product.id !== product.id);
          }
        });
      });
  };

  const removeFromCart = (productId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error(
        "Authentication required. Please log in to remove items from your cart."
      );
    }

    // Optimistic update - update local state immediately
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );

    // Persist to database
    axios
      .delete("/api/cart/remove", { data: { userId: user.id, productId } })
      .catch((error) => {
        console.error("Failed to remove cart item from database:", error);
        // Revert the optimistic update - need to reload cart
        loadUserCart(user.id);
      });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!isAuthenticated || !user) {
      throw new Error(
        "Authentication required. Please log in to update your cart."
      );
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Optimistic update - update local state immediately
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    // Persist to database
    axios
      .put("/api/cart/update", { userId: user.id, productId, quantity })
      .catch((error) => {
        console.error("Failed to update cart item in database:", error);
        // Revert the optimistic update - reload cart
        loadUserCart(user.id);
      });
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      // If not authenticated, just clear local state
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      // Clear local state immediately for better UX
      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Reload cart from server to ensure consistency
      await loadUserCart(user.id);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const loadUserCart = async (userId: string) => {
    console.log("loadUserCart called for userId:", userId);
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/cart?userId=${userId}`);
      // Transform the API response to match our CartItem interface
      const cartItems: CartItem[] = response.data.items.map((item: unknown) => {
        const i = item as {
          product: {
            id: string;
            name: string;
            price: number;
            images?: { url: string }[];
            category?: { name: string };
          };
          quantity: number;
          priceAtTimeOfAddition: number;
        };
        return {
          product: {
            id: i.product.id,
            name: i.product.name,
            price: `₵${(i.priceAtTimeOfAddition || i.product.price).toFixed(
              2
            )}`,
            image: i.product.images?.[0]?.url || "/placeholder-image.jpg",
            category: i.product.category?.name || "General",
          },
          quantity: i.quantity,
        };
      });
      console.log("Setting cart items from API:", cartItems.length);
      setItems(cartItems);
    } catch (error) {
      console.error("Error loading user cart:", error);
      // If cart doesn't exist, we'll create one when adding items
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    loadUserCart,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
