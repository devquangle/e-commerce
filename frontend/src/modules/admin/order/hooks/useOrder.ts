import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderFilterRequest } from "../types/order.search.type";
import type { Pagination } from "@/types/pagination";
import type { OrderResponse, OrderStatus } from "../types/order.type";
import OrderService from "../services/order.service";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";

export const useFilterOrder = (options?: OrderFilterRequest) => {
  return useQuery<Pagination<OrderResponse>>({
    queryKey: ["orders-filter", options],
    queryFn: () => OrderService.search(options),
  });
};

export const useOrder = useFilterOrder;

export const useOrderDetail = (orderCode?: string) => {
  return useQuery({
    queryKey: ["orderDetail", orderCode],
    queryFn: () => OrderService.getOrderDetail(orderCode),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      OrderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-filter"] });
      showSuccessToast("Duyệt đơn hàng thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi duyệt đơn hàng.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      OrderService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-filter"] });
      showSuccessToast("Hủy đơn hàng thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi hủy đơn hàng.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
