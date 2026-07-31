import { apiAuth } from "@/configs/axios";
import type { OrderFilterRequest } from "../types/order.search.type";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type { OrderResponse, OrderStatus } from "../types/order.type";

const OrderService = {
  async search(options?: OrderFilterRequest) {
    const start = performance.now();
    const res = await apiAuth.get<ApiResponse<Pagination<OrderResponse>>>(
      "/api/v1/admin/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch list order failed");
    }
    const end = performance.now();
    console.log(`Time: ${((end - start) / 1000).toFixed(2)} s`);
    console.log(res.data.data);
    return res.data.data;
  },

  async updateStatus(id: number, status: OrderStatus) {
    const res = await apiAuth.put<ApiResponse<OrderResponse>>(
      `/api/v1/admin/orders/${id}/status`,
      { status }
    );
    return res.data.data;
  },

  async cancel(id: number, reason?: string) {
    const res = await apiAuth.put<ApiResponse<OrderResponse>>(
      `/api/v1/admin/orders/${id}/cancel`,
      { cancel: reason }
    );
    return res.data.data;
  },
};

export default OrderService;
