import React, { useState } from "react";
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

interface PaystackResponse {
  message: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

interface UsePaystackProps {
  onSuccess?: (response: PaystackResponse) => void;
  onClose?: () => void;
}

export const usePaystack = ({ onSuccess, onClose }: UsePaystackProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaystackReady, setIsPaystackReady] = useState(false);

  // Check if Paystack is ready
  React.useEffect(() => {
    const checkPaystackReady = () => {
      if (typeof window !== "undefined" && window.PaystackPop) {
        setIsPaystackReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkPaystackReady()) return;

    // If not ready, check periodically
    const interval = setInterval(() => {
      if (checkPaystackReady()) {
        clearInterval(interval);
      }
    }, 100);

    // Clean up after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.warn("Paystack script did not load within 10 seconds");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const initializePayment = (paymentData: PaymentData) => {
    // Check if script is loaded
    if (typeof window === "undefined") {
      console.error("Window object not available");
      return;
    }

    if (!isPaystackReady || !window.PaystackPop) {
      console.error(
        "Paystack script not ready. Please wait for the page to fully load."
      );
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      console.error("Paystack public key not configured");
      return;
    }

    setIsLoading(true);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: paymentData.email,
          amount: paymentData.amount,
          currency: paymentData.currency,
          ref: paymentData.reference,
          metadata: paymentData.metadata,
          callback: function (response: PaystackResponse) {
            setIsLoading(false);
            console.log("Payment successful:", response);
            if (onSuccess) {
              onSuccess(response);
            }
          },
          onClose: function () {
            setIsLoading(false);
            console.log("Payment popup closed");
            if (onClose) {
              onClose();
            }
          },
        });

        // Open the payment modal immediately
        handler.openIframe();
      } catch (error) {
        console.error("Error initializing Paystack payment:", error);
        setIsLoading(false);
      }
    }, 100);
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
    isPaystackReady,
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
