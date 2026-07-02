import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { PromotionProductMappingResponse } from "../types/promotion.product.type";

const PromotionProductService = {
  async getPromotionProducts(productIds: number[]) {
    const res = await apiAuth.get<
      ApiResponse<PromotionProductMappingResponse[]>
    >("/api/v1/admin/promotions/by-products", {
      params: { productIds: productIds.join(",") },
    });
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch promotions failed");
    }
    console.log(res);
    return res.data.data;
  },
};
export default PromotionProductService;
