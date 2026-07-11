import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type {
  VoucherRequest,
  VoucherResponse,
  VoucherSearchRequest,
} from "../types/voucher.type";

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
  async getVoucherById(id: number) {
    const res = await apiAuth.get<ApiResponse<VoucherResponse>>(
      `/api/v1/vouchers/${id}`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch voucher failed");
    }
    return res.data.data;
  },
  async createVoucher(data: VoucherRequest) {
    const res = await apiAuth.post<ApiResponse<VoucherResponse>>(
      "/api/v1/vouchers",
      data,
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Create voucher failed");
    }

    return res.data.data;
  },

  async updateVoucher(id: number, data: VoucherRequest) {
    const res = await apiAuth.put<ApiResponse<VoucherResponse>>(
      `/api/v1/vouchers/${id}`,
      data,
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update voucher failed");
    }

    return res.data.data;
  },

  async deleteVoucher(id: number) {
    const res = await apiAuth.delete<ApiResponse<void>>(
      `/api/v1/vouchers/${id}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete voucher failed");
    }
    return res.data;
  },
};
export default VoucherService;
