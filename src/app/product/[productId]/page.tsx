"use client";

import React from "react";
import { useProduct } from "../../hooks/useProducts";
import ProductDisplay from "../../components/product/ProductDisplay";
import ProductLoading from "../../components/product/ProductLoading";
import ProductNotFound from "../../components/product/ProductNotFound";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const [productId, setProductId] = React.useState<string>("");

  // Unwrap params promise
  React.useEffect(() => {
    params.then((p) => setProductId(p.productId));
  }, [params]);

  // Use the client-side hook for data fetching
  const { data: product, isLoading, error } = useProduct(productId);

  // Show loading state
  if (isLoading) {
    return <ProductLoading />;
  }

  // If there's an error or product not found, show not found state
  if (error || !product) {
    return <ProductNotFound />;
  }

  return <ProductDisplay product={product} />;
};

export default ProductPage;
