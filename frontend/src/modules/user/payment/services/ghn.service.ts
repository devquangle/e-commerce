import { apiGuest } from "@/configs/axios";
import type { ShippingFeeRequest } from "../types/shipping-fee.types";
import type { ApiResponse } from "@/types/api-response";

const GHNService = {
  async getShippingFee(data: ShippingFeeRequest) {
    try {
      const res = await apiGuest.post<ApiResponse<number>>(
        "/public/ghn/shipping-fee",
        data,
      );

      if (!res.data.success || res.data.data === undefined || res.data.data === null) {
        return 0;
      }
      return res.data.data;
    } catch (error) {
      console.warn("GHN Shipping fee error, fallback to 0:", error);
      return 0;
    }
  },
};
export default GHNService;
