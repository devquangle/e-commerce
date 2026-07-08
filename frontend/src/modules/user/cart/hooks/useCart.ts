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
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      CartService.updateQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
    },
  });
};

export const useToggleCartItem = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: ({ cartItemId, checked }: { cartItemId: number; checked: boolean }) =>
      CartService.toggleItem(cartItemId, checked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
    },
  });
};

export const useToggleAllCartItems = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (checked: boolean) => CartService.toggleAll(checked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
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
      queryClient.invalidateQueries({ queryKey: ["cartCount", userInfo?.code] });
    },
  });
};

export const useRemoveCartItems = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (cartItemIds: number[]) => CartService.removeCartItems(cartItemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userInfo?.code] });
      queryClient.invalidateQueries({ queryKey: ["cartCount", userInfo?.code] });
    },
  });
};
