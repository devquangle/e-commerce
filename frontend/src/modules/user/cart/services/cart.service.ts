import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { CartCountResponse, CartResponse } from "../types/cart.type";

const CartService = {
  async getCartItems() {
    const res = await apiAuth.get<ApiResponse<CartResponse>>("/api/v1/cart");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch cart items failed");
    }
    console.log(res.data.data);
    return res.data.data;
  },
  async saveCartItem(productId: number, quantity: number) {
    const res = await apiAuth.post<ApiResponse<void>>("/api/v1/cart", {
      productId,
      quantity,
    });
    return res.data;
  },
  async updateQuantity(cartItemId: number, quantity: number) {
    const res = await apiAuth.put<ApiResponse<any>>(
      `/api/v1/cart/update/${cartItemId}`,
      { quantity },
    );
    return res.data;
  },

  async removeCartItem(cartItemId: number) {
    const res = await apiAuth.delete<ApiResponse<any>>(
      `/api/v1/cart/${cartItemId}`,
    );
    return res.data;
  },
  async removeCartItems(cartItemIds: number[]) {
    const res = await apiAuth.post<ApiResponse<any>>(
      `/api/v1/cart/remove-multiple`,
      { cartItemIds },
    );
    return res.data;
  },
  async countCartItems() {
    const res =
      await apiAuth.get<ApiResponse<CartCountResponse>>("/api/v1/cart/count");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch cart items failed");
    }
    return res.data.data;
  },
};

export default CartService;
