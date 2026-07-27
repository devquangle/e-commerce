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

  productPublisher: ProductPublisherResponse;
  productSeries: ProductSeriesResponse | null;
  productGenres: ProductGenreResponse[] | [];
  productAuthors: ProductAuthorResponse[] | [];
  urlImage: string;
}

export interface ProductGenreResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductAuthorResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductSeriesResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductPublisherResponse {
  id: number;
  name: string;
  slug: string;
}

/** UI state cho trang giỏ hàng / thanh toán */


export interface CartCountResponse {
  count: number;
}

export const getAuthorNames = (product: ProductResponse): string =>
  product.productAuthors?.map((a) => a.name).join(", ") || "Không rõ tác giả";



export const getLineTotal = (item: CartResponse): number =>
  item.product.price * item.quantity;


import type { VoucherUserResponse } from "@/modules/admin/voucher/types/voucher.type";

export type CouponOption = VoucherUserResponse;

