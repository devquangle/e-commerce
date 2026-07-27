import type { ApiResponse } from "@/types/api-response";
import type { Order, OrderRequest } from "../types/order.type";
import { apiAuth } from "@/configs/axios";

const OrderService = {
  async createOrder(data: OrderRequest) {
    const res = await apiAuth.post<ApiResponse<Order>>(
      "/api/v1/my-order",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch create order failed");
    }
    console.log(res.data.data);
    return res.data.data;
  },
};
export default OrderService;
