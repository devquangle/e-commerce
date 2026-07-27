export interface CartResponse {
  cartItemId: number;
  quantity: number;
  product: ProductResponse;
  checked: boolean;
}


export interface CartItemResponse {
  cartItemId: number;
  quantity: number;
  productId: number;
}


export interface CartItemRequest {
  quantity: number;
  productId: number;
}


export interface ProductResponse {
  productId: number;
  name: string;
  slug: string;
  isbn: string;
  discountValue: number; //%
  price: number; //giá bán
  quantity: number;
  weight: number;
  publishYear: string;
  pages: number;
  language?: string;

  publisher: string;
  series: string | null;
  genres: string[] | [];
  authors: string[] | [];
  urlImage: string;
}



/** UI state cho trang giỏ hàng / thanh toán */


export interface CartCountResponse {
  count: number;
}




export const getLineTotal = (item: CartResponse): number =>
  item.product.price * item.quantity;


import type { VoucherUserResponse } from "@/modules/admin/voucher/types/voucher.type";

export type CouponOption = VoucherUserResponse;

