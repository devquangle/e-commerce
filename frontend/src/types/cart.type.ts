export interface CartResponse {
  cartItemId: number;
  quantity: number;
  items: ProductResponse[] | [];
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  isbn: string;
  originalPrice: number;
  price: number;
  quantity: number;
  weight: number;
  publishYear: string;
  pages: number;

  publisherName: string;
  seriesName: string;

  urlImageDefault: string;
  description: string;
  productGenres: ProductGenreResponse[] | [];
  productAuthors: ProductAuthorResponse[] | [];
}

export interface ProductGenreResponse {
  id: number;
  name: string;
}

export interface ProductAuthorResponse {
  id: number;
  name: string;
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
      originalPrice: 200000,
      price: 150000,
      quantity: 100,
      weight: 300,
      publishYear: "2020",
      pages: 320,
      publisherName: "NXB Trẻ",
      seriesName: "Bìa mềm",
      urlImageDefault: "https://picsum.photos/seed/book1/200/280",
      description: "",
      productGenres: [],
      productAuthors: [{ id: 1, name: "Dale Carnegie" }],
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
      originalPrice: 420000,
      price: 350000,
      quantity: 50,
      weight: 450,
      publishYear: "2019",
      pages: 512,
      publisherName: "Alphabooks",
      seriesName: "Bìa cứng",
      urlImageDefault: "https://picsum.photos/seed/book2/200/280",
      description: "",
      productGenres: [],
      productAuthors: [{ id: 2, name: "Daniel Kahneman" }],
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
      originalPrice: 320000,
      price: 280000,
      quantity: 80,
      weight: 380,
      publishYear: "2021",
      pages: 544,
      publisherName: "NXB Trẻ",
      seriesName: "Bìa mềm",
      urlImageDefault: "https://picsum.photos/seed/book3/200/280",
      description: "",
      productGenres: [],
      productAuthors: [{ id: 3, name: "Yuval Noah Harari" }],
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
      originalPrice: 320000,
      price: 280000,
      quantity: 80,
      weight: 380,
      publishYear: "2021",
      pages: 544,
      publisherName: "NXB Trẻ",
      seriesName: "Bìa mềm",
      urlImageDefault: "https://picsum.photos/seed/book3/200/280",
      description: "",
      productGenres: [],
      productAuthors: [{ id: 3, name: "Yuval Noah Harari" }],
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
      originalPrice: 320000,
      price: 280000,
      quantity: 80,
      weight: 380,
      publishYear: "2021",
      pages: 544,
      publisherName: "NXB Trẻ",
      seriesName: "Bìa mềm",
      urlImageDefault: "https://picsum.photos/seed/book3/200/280",
      description: "",
      productGenres: [],
      productAuthors: [{ id: 3, name: "Yuval Noah Harari" }],
    },
  },
];

export const MOCK_COUPONS: CouponOption[] = [
  { code: "SALE10", description: "Giảm 10% đơn hàng", discountPercent: 10 },
  { code: "FREESHIP", description: "Miễn phí vận chuyển", discountPercent: 0 },
  { code: "BOOK20", description: "Giảm 20% sách", discountPercent: 20 },
];

