import { apiAuth } from "@/configs/axios";
import type { PromotionFilter } from "../types/promotion.search.type";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type { PromotionResponse } from "../types/promotion.type";

const PromotionService = {
  async search(options?: PromotionFilter) {
    const res = await apiAuth.get<ApiResponse<Pagination<PromotionResponse>>>(
      "/api/v1/admin/promotions/search",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch promotions failed");
    }
    console.log(res);
    return res.data.data;
  },
};
export default PromotionService;
