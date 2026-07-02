import { useQuery } from "@tanstack/react-query";
import PromotionProductService from "../services/promotion.product.service";
import type { PromotionProductMappingResponse } from "../types/promotion.product.type";

export const useGetPromotionProducts = (productIds: number[]) => {
  return useQuery<PromotionProductMappingResponse[]>({
    queryKey: ["promotion-products-mapping", productIds],
    queryFn: () => PromotionProductService.getPromotionProducts(productIds),
    enabled: productIds.length > 0,
  });
};
