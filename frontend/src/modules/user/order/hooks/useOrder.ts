import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderService from "../services/order.service";
import { useAuth } from "@/context/useAuth";
import type { OrderRequest } from "../types/order.type";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();

  return useMutation({
    mutationFn: (data: OrderRequest) => OrderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
      queryClient.invalidateQueries({
        queryKey: ["cartCount", userInfo?.code],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders", userInfo?.code],
      });
    },
  });
};

export const useOrderDetail = (orderCode?: string) => {
  const { isInitialized, userInfo } = useAuth();

  return useQuery({
    queryKey: ["orderDetail", userInfo?.code, orderCode],
    queryFn: () => OrderService.getOrderDetail(orderCode),
    enabled: isInitialized && !!userInfo && !!orderCode,
  });
};

