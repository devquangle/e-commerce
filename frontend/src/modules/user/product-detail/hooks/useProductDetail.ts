import ProductDetailService from "../services/product.detail.service";
import type { ProductResponse } from "../types/product-detail.type";
import { useQuery } from "@tanstack/react-query";

export const useProductDetail = (slug?: string) => {
  return useQuery<ProductResponse>({
    queryKey: ["product-detail", slug],
    queryFn: () => ProductDetailService.getProductBySlug(slug!),
    enabled: !!slug,
  });
};
