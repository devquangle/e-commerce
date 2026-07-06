import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { CartCountResponse, CartResponse } from "../types/cart.type";

const CartService = {
  async getCartItems() {
    const res =
      await apiAuth.get<ApiResponse<CartResponse>>("/api/v1/cart");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch cart items failed");
    }
    console.log(res.data.data);
    return res.data.data;
  },
  //   async addToCart(productId: string, quantity: number) {},
  //   async updateCartItem(cartItemId: string, quantity: number) {},
  //   async removeCartItem(cartItemId: string) {},
  //   async removeCartItems(cartItemIds: number[]) {},
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
