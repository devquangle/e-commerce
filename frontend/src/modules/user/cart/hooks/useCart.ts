import { useQuery } from "@tanstack/react-query";
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
  return useQuery<CartResponse>({
    queryKey: ["cart", userInfo?.code],
    queryFn: CartService.getCartItems,
    enabled: isInitialized && !!userInfo,
  });
};
