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

export interface CouponOption {
  code: string;
  description: string;
  discountPercent: number;
}

export interface CartCountResponse {
  count: number;
}

export const getAuthorNames = (product: ProductResponse): string =>
  product.productAuthors?.map((a) => a.name).join(", ") || "Không rõ tác giả";



export const getLineTotal = (item: CartResponse): number =>
  item.product.price * item.quantity;

export const MOCK_CART_ITEMS: CartResponse[] = [
  {
    cartItemId: 1,
    quantity: 1,
    checked: true,
    product: { productId: 1,
      name: "Nghệ Thuật Bán Hàng Bậc Cao",
      slug: "nghe-thuat-ban-hang-bac-cao",
      isbn: "978-604-1",
      discountValue: 25,
      price: 150000,
      quantity: 100,
      weight: 500,
      publishYear: "2019-01-01",
      pages: 520,
      language: "Tiếng Việt",
      productPublisher: { id: 1, name: "Nhà xuất bản Trẻ", slug: "nxb-tre" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [
        { id: 1, name: "Khác", slug: "khac" },
      ],
      productAuthors: [{ id: 1, name: "Zig Ziglar", slug: "zig-ziglar" }],
      urlImage: "https://picsum.photos/seed/book1/200/280",
    },
  },
];

export const MOCK_COUPONS: CouponOption[] = [
  { code: "SALE10", description: "Giảm 10% đơn hàng", discountPercent: 10 },
  { code: "FREESHIP", description: "Miễn phí vận chuyển", discountPercent: 0 },
  { code: "BOOK20", description: "Giảm 20% sách", discountPercent: 20 },
];
