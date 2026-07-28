import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderService from "../services/order.service";
import { useAuth } from "@/context/useAuth";
import type {
  CancelOrderRequest,
  ChangeAddressRequest,
  OrderRequest,
} from "../types/order.type";
import type { OrderFilterRequest } from "../types/order.search.type";

export const useSearchOrderByUser = (options?: OrderFilterRequest) => {
  const { isInitialized, userInfo } = useAuth();

  return useQuery({
    queryKey: ["orders", userInfo?.code, options],
    queryFn: () => OrderService.getMyOrders(options),
    enabled: isInitialized && !!userInfo,
  });
};

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

export const useChangeAddress = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();

  return useMutation({
    mutationFn: (data: ChangeAddressRequest) =>
      OrderService.changeAddress(data),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["orderDetail", userInfo?.code, variables.orderCode],
        }),
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        }),
      ]);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();

  return useMutation({
    mutationFn: (data: CancelOrderRequest) => OrderService.cancelOrder(data),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["orderDetail", userInfo?.code, variables.orderCode],
        }),
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        }),
      ]);
    },
  });
};
