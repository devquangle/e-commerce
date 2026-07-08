import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CartService from "../services/cart.service";
import { useAuth } from "@/context/useAuth";
import type { CartCountResponse, CartResponse } from "../types/cart.type";

export const useCartCount = () => {
  const { isInitialized, userInfo } = useAuth();
  return useQuery<CartCountResponse>({
    queryKey: ["cartCount", userInfo?.code],
    queryFn: CartService.countCartItems,
    enabled: isInitialized && !!userInfo,
  });
};

export const useCartData = () => {
  const { isInitialized, userInfo } = useAuth();
  return useQuery<CartResponse[]>({
    queryKey: ["cart", userInfo?.code],
    queryFn: CartService.getCartItems as any,
    enabled: isInitialized && !!userInfo,
    structuralSharing: (oldData, newData) => {
      if (!oldData) return newData as CartResponse[];
      const oldArray = oldData as CartResponse[];
      const newArray = newData as CartResponse[];
      return newArray.map((newItem) => {
        const oldItem = oldArray.find(
          (o) => o.cartItemId === newItem.cartItemId
        );
        return {
          ...newItem,
          checked: oldItem !== undefined ? oldItem.checked : newItem.checked,
        };
      });
    },
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
      queryClient.setQueryData<CartResponse[]>(
        ["cart", userInfo?.code],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((item) =>
            item.cartItemId === cartItemId ? { ...item, checked } : item,
          );
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
      queryClient.setQueryData<CartResponse[]>(
        ["cart", userInfo?.code],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((item) => ({ ...item, checked }));
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
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
      queryClient.invalidateQueries({
        queryKey: ["cartCount", userInfo?.code],
      });
    },
  });
};

export const useSaveCartItem = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => CartService.saveCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
      queryClient.invalidateQueries({
        queryKey: ["cartCount", userInfo?.code],
      });
    },
  });
};
