import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import "@/app/types/paystack";

interface PaymentData {
  email: string;
  amount: number; // Amount in kobo (smallest currency unit)
  currency: string;
  reference: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

interface UsePaystackProps {
  onSuccess?: (response: any) => void;
  onClose?: () => void;
}

export const usePaystack = ({ onSuccess, onClose }: UsePaystackProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const initializePayment = (paymentData: PaymentData) => {
    if (!window.PaystackPop) {
      console.error("Paystack script not loaded");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      console.error("Paystack public key not configured");
      return;
    }

    setIsLoading(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: paymentData.email,
      amount: paymentData.amount,
      currency: paymentData.currency,
      ref: paymentData.reference,
      metadata: paymentData.metadata,
      callback: function (response: any) {
        setIsLoading(false);
        if (onSuccess) {
          onSuccess(response);
        }
      },
      onClose: function () {
        setIsLoading(false);
        if (onClose) {
          onClose();
        }
      },
    });

    handler.openIframe();
  };

  const generateReference = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return `shop_${timestamp}_${random}`;
  };

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };

  return {
    initializePayment,
    generateReference,
    verifyPayment,
    isLoading,
  };
};

// Utility function to convert amount to kobo
export const toKobo = (amount: number): number => {
  return Math.round(amount * 100);
};

// Utility function to format currency
export const formatCurrency = (
  amount: number,
  currency: string = "GHS"
): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
