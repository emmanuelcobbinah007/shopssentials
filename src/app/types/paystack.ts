// Paystack types
export interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  callback: (response: any) => void;
  onClose: () => void;
}

export interface PaystackHandler {
  openIframe: () => void;
}

export interface PaystackPop {
  setup: (options: PaystackOptions) => PaystackHandler;
}

declare global {
  interface Window {
    PaystackPop: PaystackPop;
  }
}
