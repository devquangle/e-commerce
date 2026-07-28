import type { ApiResponse } from "@/types/api-response";
import type {
  ChangeAddressRequest,
  OrderDetailResponse,
  OrderRequest,
  OrderResponse,
} from "../types/order.type";
import { apiAuth } from "@/configs/axios";
import type { Pagination } from "@/types/pagination";
import type { OrderFilterRequest } from "../types/order.search.type";

const OrderService = {
  async createOrder(data: OrderRequest) {
    const res = await apiAuth.post<ApiResponse<OrderResponse>>(
      "/api/v1/my-order",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch create order failed");
    }
    console.log(res.data.data);
    return res.data.data;
  },
  async getMyOrders(options?: OrderFilterRequest) {
    const res = await apiAuth.get<ApiResponse<Pagination<OrderResponse>>>(
      "/api/v1/my-order",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch list order failed");
    }
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

  async changeAddress(data: ChangeAddressRequest) {
    const res = await apiAuth.post<ApiResponse<void>>(
      "/api/v1/order/change-address",
      data
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Fetch change-address failed");
    }
    return res.data.data;
  },
};
export default OrderService;
