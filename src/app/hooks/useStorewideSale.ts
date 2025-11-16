import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface StorewideSale {
  id: string;
  storefront: string;
  isActive: boolean;
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
}

interface StorewideSaleResponse {
  hasSale: boolean;
  discountPercent: number;
  sale: StorewideSale | null;
}

export const useStorewideSale = (storefront: string = "SHOPSSENTIALS") => {
  return useQuery({
    queryKey: ["storewide-sale", storefront],
    queryFn: async (): Promise<StorewideSaleResponse> => {
      const response = await axios.get(
        `/api/storewide-sale?storefront=${storefront}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
