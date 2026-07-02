import { apiAuth } from "@/configs/axios";
import type { PromotionFilter } from "../types/promotion.search.type";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type {
  PromotionDetailResponse,
  PromotionRequest,
  PromotionResponse,
  PromotionWithProductCountResponse,
} from "../types/promotion.type";

const PromotionService = {
  async search(options?: PromotionFilter) {
    const res = await apiAuth.get<ApiResponse<Pagination<PromotionWithProductCountResponse>>>(
      "/api/v1/admin/promotions/search",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch promotions failed");
    }
    console.log(res);
    return res.data.data;
  },
  async create(data: PromotionRequest) {
    console.log(data);

    const res = await apiAuth.post<ApiResponse<PromotionResponse>>(
      "/api/v1/admin/promotions",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add promotion failed");
    }
    return res.data.data;
  },
  async edit(id: number) {
    const res = await apiAuth.get<ApiResponse<PromotionDetailResponse>>(
      `/api/v1/admin/promotions/${id}`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch promotion");
    }
    console.log("EDIT PROMOTION " + res.data.data);

    return res.data.data;
  },
  async update(id: number, data: PromotionRequest) {
    const res = await apiAuth.put<ApiResponse<PromotionResponse>>(
      `/api/v1/admin/promotions/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update promotion failed");
    }
    return res.data.data;
  },
  async delete(id: number) {
    const res = await apiAuth.delete<ApiResponse<null>>(
      `/api/v1/admin/promotions/${id}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete promotion failed");
    }
    return res.data;
  },
};
export default PromotionService;
