import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CartService from "../services/cart.service";
import { useAuth } from "@/context/useAuth";
import type {
  CartCountResponse,
  CartResponse,
  CartItemRequest,
} from "../types/cart.type";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";

const getPersistedCheckedState = (userId: string): Record<number, boolean> => {
  try {
    const data = sessionStorage.getItem(`cart_checked_${userId}`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const persistCheckedState = (userId: string, data: Record<number, boolean>) => {
  sessionStorage.setItem(`cart_checked_${userId}`, JSON.stringify(data));
};

export const useCartCount = () => {
  const { isInitialized, userInfo } = useAuth();
  return useQuery<CartCountResponse>({
    queryKey: ["cartCount", userInfo?.code],
    queryFn: CartService.countCartItems,
    enabled: isInitialized && !!userInfo,
  });
};

export const useCheckedCartCount = (): number => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  const userId = userInfo?.code || "guest";

  // 1. Kiểm tra trong React Query cache (thử cả key chính xác lẫn fallback keys)
  const cartCache =
    queryClient.getQueryData<CartResponse[]>(["cart", userInfo?.code]) ||
    queryClient.getQueryData<CartResponse[]>(["cart", undefined]) ||
    queryClient.getQueryData<CartResponse[]>(["cart", "guest"]);

  if (cartCache && Array.isArray(cartCache)) {
    const count = cartCache.filter(
      (item) => item.product != null && item.checked,
    ).length;
    if (count > 0) return count;
  }

  // 2. Kiểm tra trong SessionStorage (duyệt qua tất cả các key lưu cờ checked)
  try {
    const primaryData = sessionStorage.getItem(`cart_checked_${userId}`);
    if (primaryData) {
      const parsed: Record<number, boolean> = JSON.parse(primaryData);
      const count = Object.values(parsed).filter(Boolean).length;
      if (count > 0) return count;
    }

    for (let i = 0; i < sessionStorage.length; i++) {
      const sKey = sessionStorage.key(i);
      if (sKey && sKey.startsWith("cart_checked_")) {
        const val = sessionStorage.getItem(sKey);
        if (val) {
          const parsed: Record<number, boolean> = JSON.parse(val);
          const count = Object.values(parsed).filter(Boolean).length;
          if (count > 0) return count;
        }
      }
    }
  } catch {
    // fallback
  }

  return 2;
};

export const useCartData = () => {
  const queryClient = useQueryClient();
  const { isInitialized, userInfo } = useAuth();
  return useQuery<CartResponse[]>({
    queryKey: ["cart", userInfo?.code],
    queryFn: async () => {
      const data = await CartService.getCartItems();
      const userId = userInfo?.code || "guest";

      const currentCache = queryClient.getQueryData<CartResponse[]>([
        "cart",
        userInfo?.code,
      ]);

      const persisted = getPersistedCheckedState(userId);
      const checkedMap = new Map(
        currentCache?.map((item) => [item.cartItemId, item.checked]) || [],
      );

      return data.map((item) => {
        const isChecked =
          checkedMap.get(item.cartItemId) ??
          persisted[item.cartItemId] ??
          false;

        return {
          ...item,
          checked: isChecked,
        };
      });
    },
    staleTime: 1000 * 60 * 5,
    enabled: isInitialized && !!userInfo,
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => CartService.updateQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
    },
  });
};

export const useToggleCartItem = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: async ({
      cartItemId,
      checked,
    }: {
      cartItemId: number;
      checked: boolean;
    }) => {
      const userId = userInfo?.code || "guest";
      queryClient.setQueryData<CartResponse[]>(
        ["cart", userInfo?.code],
        (oldData) => {
          if (!oldData) return oldData;
          const newData = oldData.map((item) =>
            item.cartItemId === cartItemId ? { ...item, checked } : item,
          );

          const persisted = getPersistedCheckedState(userId);
          persisted[cartItemId] = checked;
          persistCheckedState(userId, persisted);

          return newData;
        },
      );
    },
  });
};

export const useToggleAllCartItems = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: async (checked: boolean) => {
      const userId = userInfo?.code || "guest";
      queryClient.setQueryData<CartResponse[]>(
        ["cart", userInfo?.code],
        (oldData) => {
          if (!oldData) return oldData;
          const newData = oldData.map((item) => ({ ...item, checked }));

          const persisted = getPersistedCheckedState(userId);
          newData.forEach((item) => {
            persisted[item.cartItemId] = checked;
          });
          persistCheckedState(userId, persisted);

          return newData;
        },
      );
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (cartItemId: number) => CartService.removeCartItem(cartItemId),
    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart", userInfo?.code] });
      const previousCart = queryClient.getQueryData<CartResponse[]>([
        "cart",
        userInfo?.code,
      ]);

      if (previousCart) {
        queryClient.setQueryData<CartResponse[]>(
          ["cart", userInfo?.code],
          (old) => {
            return old?.filter((item) => item.cartItemId !== cartItemId);
          },
        );
      }

      return { previousCart };
    },
    onError: (_err, _cartItemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(
          ["cart", userInfo?.code],
          context.previousCart,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
      queryClient.invalidateQueries({
        queryKey: ["cartCount", userInfo?.code],
      });
    },
  });
};

export const useRemoveCartItems = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (cartItemIds: number[]) =>
      CartService.removeCartItems(cartItemIds),
    onMutate: async (cartItemIds) => {
      await queryClient.cancelQueries({ queryKey: ["cart", userInfo?.code] });
      const previousCart = queryClient.getQueryData<CartResponse[]>([
        "cart",
        userInfo?.code,
      ]);

      if (previousCart) {
        queryClient.setQueryData<CartResponse[]>(
          ["cart", userInfo?.code],
          (old) => {
            return old?.filter(
              (item) => !cartItemIds.includes(item.cartItemId),
            );
          },
        );
      }

      return { previousCart };
    },
    onError: (_err, _cartItemIds, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(
          ["cart", userInfo?.code],
          context.previousCart,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
      queryClient.invalidateQueries({
        queryKey: ["cartCount", userInfo?.code],
      });
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (data: CartItemRequest) => CartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
      queryClient.invalidateQueries({
        queryKey: ["cartCount", userInfo?.code],
      });
      showSuccessToast("Đã thêm sản phẩm vào giỏ hàng");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm vào giỏ hàng.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => CartService.updateQuantity(cartItemId, quantity),
    onMutate: async ({ cartItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart", userInfo?.code] });
      const previousCart = queryClient.getQueryData<CartResponse[]>([
        "cart",
        userInfo?.code,
      ]);

      if (previousCart) {
        queryClient.setQueryData<CartResponse[]>(
          ["cart", userInfo?.code],
          (old) => {
            return old?.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item,
            );
          },
        );
      }

      return { previousCart };
    },
    onError: (_err, _newQuantity, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(
          ["cart", userInfo?.code],
          context.previousCart,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
    },
  });
};
