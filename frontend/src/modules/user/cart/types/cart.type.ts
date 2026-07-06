export interface CartResponse {
  cartItemId: number;
  quantity: number;
  productCartItemResponse: ProductResponse;
}
export interface ProductResponse  {
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

export interface CartCountResponse {
  count: number;
}

export const getAuthorNames = (product: ProductResponse): string =>
  product.productAuthors?.map((a) => a.name).join(", ") || "Không rõ tác giả";

export const mapCartResponseToUI = (c: CartResponse): CartItemUI => ({
  cartItemId: c.cartItemId,
  quantity: c.quantity,
  checked: true,
  product: c.productCartItemResponse,
});

export const getLineTotal = (item: CartItemUI): number =>
  item.product.price * item.quantity;

export const MOCK_CART_ITEMS: CartItemUI[] = [
  {
    cartItemId: 1,
    quantity: 1,
    checked: true,
    product: {
      id: 1,
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
      description: "",
      productPublisher: { id: 1, name: "Nhà xuất bản Trẻ", slug: "nxb-tre" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [
        { id: 1, name: "Khác", slug: "khac" },
        { id: 2, name: "Tài Chính Cá Nhân", slug: "tai-chinh-ca-nhan" },
        { id: 3, name: "Kinh Tế", slug: "kinh-te" }
      ],
      productAuthors: [{ id: 1, name: "Zig Ziglar", slug: "zig-ziglar" }],
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
      language: "Tiếng Việt",
      description: "",
      productPublisher: { id: 2, name: "Alphabooks", slug: "alphabooks" },
      productSeries: { id: 2, name: "Bìa cứng", slug: "bia-cung" },
      productGenres: [
        { id: 4, name: "Tâm Lý Học", slug: "tam-ly-hoc" },
        { id: 3, name: "Kinh Tế", slug: "kinh-te" }
      ],
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
      language: "Tiếng Việt",
      description: "",
      productPublisher: { id: 1, name: "Nhà xuất bản Trẻ", slug: "nxb-tre" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [
        { id: 5, name: "Lịch Sử", slug: "lich-su" },
        { id: 6, name: "Khoa Học", slug: "khoa-hoc" }
      ],
      productAuthors: [{ id: 3, name: "Yuval Noah Harari", slug: "yuval-noah-harari" }],
      coverImages: [{ url: "https://picsum.photos/seed/book3/200/280", isThumbnail: true }],
    },
  },
  {
    cartItemId: 4,
    quantity: 1,
    checked: true,
    product: {
      id: 4,
      name: "Atomic Habits",
      slug: "atomic-habits",
      isbn: "978-604-4",
      discountValue: 20,
      price: 160000,
      quantity: 120,
      weight: 350,
      publishYear: "2022",
      pages: 320,
      language: "Tiếng Việt",
      description: "",
      productPublisher: { id: 3, name: "1980 Books", slug: "1980-books" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [
        { id: 2, name: "Phát Triển Bản Thân", slug: "phat-trien-ban-than" },
        { id: 4, name: "Tâm Lý Học", slug: "tam-ly-hoc" }
      ],
      productAuthors: [{ id: 4, name: "James Clear", slug: "james-clear" }],
      coverImages: [{ url: "https://picsum.photos/seed/book4/200/280", isThumbnail: true }],
    },
  },
  {
    cartItemId: 5,
    quantity: 1,
    checked: true,
    product: {
      id: 5,
      name: "Nhà Giả Kim",
      slug: "nha-gia-kim",
      isbn: "978-604-5",
      discountValue: 15,
      price: 67150,
      quantity: 200,
      weight: 250,
      publishYear: "2020",
      pages: 228,
      language: "Tiếng Việt",
      description: "",
      productPublisher: { id: 4, name: "Nhã Nam", slug: "nha-nam" },
      productSeries: { id: 1, name: "Bìa mềm", slug: "bia-mem" },
      productGenres: [
        { id: 7, name: "Tiểu Thuyết", slug: "tieu-thuyet" },
        { id: 8, name: "Văn Học", slug: "van-hoc" }
      ],
      productAuthors: [{ id: 5, name: "Paulo Coelho", slug: "paulo-coelho" }],
      coverImages: [{ url: "https://picsum.photos/seed/book5/200/280", isThumbnail: true }],
    },
  },
];

export const MOCK_COUPONS: CouponOption[] = [
  { code: "SALE10", description: "Giảm 10% đơn hàng", discountPercent: 10 },
  { code: "FREESHIP", description: "Miễn phí vận chuyển", discountPercent: 0 },
  { code: "BOOK20", description: "Giảm 20% sách", discountPercent: 20 },
];

