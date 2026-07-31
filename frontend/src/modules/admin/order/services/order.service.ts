import { apiAuth } from "@/configs/axios";
import type { OrderFilterRequest } from "../types/order.search.type";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type {
  CancelOrderRequest,
  OrderDetailResponse,
  OrderResponse,
  OrderStatus,
} from "../types/order.type";

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
  async getOrderDetail(orderCode?: string) {
    const res = await apiAuth.get<ApiResponse<OrderDetailResponse>>(
      "/api/v1/order",
      { params: { orderCode } },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch order failed");
    }
    console.log(res.data.data);
    return res.data.data;
  },
  async updateStatus(id: number, status: OrderStatus) {
    const res = await apiAuth.put<ApiResponse<OrderResponse>>(
      `/api/v1/admin/orders/${id}/status`,
      { status },
    );
    return res.data.data;
  },

  async cancelOrder(data: CancelOrderRequest) {
    const res = await apiAuth.post<ApiResponse<void>>(
      "/api/v1/admin/order/cancel",
      data,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Fetch cancel failed");
    }
    return res.data.data;
  },
};

export default OrderService;
