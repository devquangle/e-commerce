import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type {
  CartCountResponse,
  CartItemRequest,
  CartItemResponse,
  CartResponse,
} from "../types/cart.type";

const CartService = {
  async getCartItems() {
    const res = await apiAuth.get<ApiResponse<CartResponse[]>>("/api/v1/cart");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch cart items failed");
    }
    console.log(res.data.data);
    return res.data.data;
  },
  async addToCart(data: CartItemRequest) {
    const res = await apiAuth.post<ApiResponse<CartItemResponse>>(
      "/api/v1/cart",
      data,
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add to cart failed");
    }
    return res.data.data;
  },
  async updateQuantity(cartItemId: number, quantity: number) {
    const res = await apiAuth.put<ApiResponse<CartItemResponse>>(
      `/api/v1/cart/${cartItemId}`,
      {
        quantity,
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update cart item failed");
    }
    return res.data.data;
  },

  async removeCartItem(cartItemId: number) {
    const res = await apiAuth.delete<ApiResponse<void>>(
      `/api/v1/cart/${cartItemId}`,
    );
    return res.data;
  },
  async removeCartItems(cartItemIds: number[]) {
    const res = await apiAuth.post<ApiResponse<void>>(
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
