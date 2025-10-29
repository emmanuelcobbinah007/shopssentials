"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

interface Product {
  id: number;
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
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  loadUserCart: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const addToCart = async (product: Product, quantity: number = 1) => {
    // For now, keep local state management until we implement user authentication
    // This will be updated when we integrate with the API
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
  };

  const removeFromCart = async (productId: number) => {
    // For now, keep local state management until we implement user authentication
    // This will be updated when we integrate with the API
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    // For now, keep local state management until we implement user authentication
    // This will be updated when we integrate with the API
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: number) => {
    return items.some((item) => item.product.id === productId);
  };

  const loadUserCart = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/cart?userId=${userId}`);
      // Transform the API response to match our CartItem interface
      const cartItems: CartItem[] = response.data.items.map((item: any) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: `₵${item.product.price.toFixed(2)}`,
          image: item.product.images?.[0]?.url || "/placeholder-image.jpg",
          category: item.product.category?.name || "General",
        },
        quantity: item.quantity,
      }));
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
