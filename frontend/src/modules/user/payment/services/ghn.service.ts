import { apiGuest } from "@/configs/axios";
import type { ShippingFeeRequest } from "../types/shipping-fee.types";
import type { ApiResponse } from "@/types/api-response";

const GHNService = {
  async getShippingFee(data: ShippingFeeRequest) {
    const res = await apiGuest.post<ApiResponse<number>>(
      "/public/ghn/shipping-fee",
      data,
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch shipping fee");
    }
    return res.data.data;
  },
};
export default GHNService;
