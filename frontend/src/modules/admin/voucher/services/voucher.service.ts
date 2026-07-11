import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type { VoucherResponse, VoucherSearchRequest } from "../types/voucher.type";

const VoucherService = {
  async searchVoucher(options?: VoucherSearchRequest) {
    const res = await apiAuth.get<ApiResponse<Pagination<VoucherResponse>>>(
      "/api/v1/vouchers/search",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch vouchers failed");
    }
    return res.data.data;
  },
};
export default VoucherService;
