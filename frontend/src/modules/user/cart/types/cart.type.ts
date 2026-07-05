export interface CartResponse {
  cartItemId: number;
  quantity: number;
  items: ProductResponse[] | [];
}
export interface ProductResponse  {
  id: number;
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

  description: string;

  productPublisher: ProductPublisherResponse;
  productSeries: ProductSeriesResponse | null;
  productGenres: ProductGenreResponse[] | [];
  productAuthors: ProductAuthorResponse[] | [];
  coverImages: ProductImageResponse[] | [];
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

export interface ProductImageResponse {
  url: string;
  isThumbnail: boolean;
}


/** UI state cho trang giỏ hàng / thanh toán */
export interface CartItemUI {
  cartItemId: number;
  quantity: number;
  checked: boolean;
  product: ProductResponse;
}

export interface CouponOption {
  code: string;
  description: string;
  discountPercent: number;
}

export type PaymentMethodType = "ewallet" | "vnpay";

export const getAuthorNames = (product: ProductResponse): string =>
  product.productAuthors?.map((a) => a.name).join(", ") || "Không rõ tác giả";

export const getLineTotal = (item: CartItemUI): number =>
  item.product.price * item.quantity;

export const MOCK_CART_ITEMS: CartItemUI[] = [
  {
    cartItemId: 1,
    quantity: 1,
    checked: true,
    product: {
      id: 1,
      name: "Đắc Nhân Tâm",
      slug: "dac-nhan-tam",
      isbn: "978-604-1",
      discountValue: 25,
      price: 150000,
      quantity: 100,
      weight: 300,
      publishYear: "2020",
      pages: 320,
      description: "",
      productPublisher: { id: 1, name: "NXB Trẻ", slug: "nxb-tre" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [],
      productAuthors: [{ id: 1, name: "Dale Carnegie", slug: "dale-carnegie" }],
      coverImages: [{ url: "https://picsum.photos/seed/book1/200/280", isThumbnail: true }],
    },
  },
  {
    cartItemId: 2,
    quantity: 2,
    checked: false,
    product: {
      id: 2,
      name: "Tư Duy Nhanh Và Chậm",
      slug: "tu-duy-nhanh-va-cham",
      isbn: "978-604-2",
      discountValue: 16.67,
      price: 350000,
      quantity: 50,
      weight: 450,
      publishYear: "2019",
      pages: 512,
      description: "",
      productPublisher: { id: 2, name: "Alphabooks", slug: "alphabooks" },
      productSeries: { id: 2, name: "Bìa cứng", slug: "bia-cung" },
      productGenres: [],
      productAuthors: [{ id: 2, name: "Daniel Kahneman", slug: "daniel-kahneman" }],
      coverImages: [{ url: "https://picsum.photos/seed/book2/200/280", isThumbnail: true }],
    },
  },
  {
    cartItemId: 3,
    quantity: 1,
    checked: true,
    product: {
      id: 3,
      name: "Sapiens: Lược Sử Loài Người",
      slug: "sapiens",
      isbn: "978-604-3",
      discountValue: 12.5,
      price: 280000,
      quantity: 80,
      weight: 380,
      publishYear: "2021",
      pages: 544,
      description: "",
      productPublisher: { id: 1, name: "NXB Trẻ", slug: "nxb-tre" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [],
      productAuthors: [{ id: 3, name: "Yuval Noah Harari", slug: "yuval-noah-harari" }],
      coverImages: [{ url: "https://picsum.photos/seed/book3/200/280", isThumbnail: true }],
    },
  },
  {
    cartItemId: 4,
    quantity: 1,
    checked: true,
    product: {
      id: 3,
      name: "Sapiens: Lược Sử Loài Người",
      slug: "sapiens",
      isbn: "978-604-3",
      discountValue: 12.5,
      price: 280000,
      quantity: 80,
      weight: 380,
      publishYear: "2021",
      pages: 544,
      description: "",
      productPublisher: { id: 1, name: "NXB Trẻ", slug: "nxb-tre" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [],
      productAuthors: [{ id: 3, name: "Yuval Noah Harari", slug: "yuval-noah-harari" }],
      coverImages: [{ url: "https://picsum.photos/seed/book3/200/280", isThumbnail: true }],
    },
  },
  {
    cartItemId: 5,
    quantity: 1,
    checked: true,
    product: {
      id: 3,
      name: "Sapiens: Lược Sử Loài Người",
      slug: "sapiens",
      isbn: "978-604-3",
      discountValue: 12.5,
      price: 280000,
      quantity: 80,
      weight: 380,
      publishYear: "2021",
      pages: 544,
      description: "",
      productPublisher: { id: 1, name: "NXB Trẻ", slug: "nxb-tre" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [],
      productAuthors: [{ id: 3, name: "Yuval Noah Harari", slug: "yuval-noah-harari" }],
      coverImages: [{ url: "https://picsum.photos/seed/book3/200/280", isThumbnail: true }],
    },
  },
];

export const MOCK_COUPONS: CouponOption[] = [
  { code: "SALE10", description: "Giảm 10% đơn hàng", discountPercent: 10 },
  { code: "FREESHIP", description: "Miễn phí vận chuyển", discountPercent: 0 },
  { code: "BOOK20", description: "Giảm 20% sách", discountPercent: 20 },
];

