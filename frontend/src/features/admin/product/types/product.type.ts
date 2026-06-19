
export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number; // có thì mới hiện giảm giá
  author: string[];
  coverUrl: string;

  publishedAt: string;
  soldCount: number; // đã bán
  rating: number; // 0 → 5
  reviewCount: number; // số lượt đánh giá
  isFeatured: boolean;
}

export interface ProductRequest {
  name: string;
  authorIds: number[];
  publisherId: number | undefined;
  genreIds: number[];
  weight: number;
  publishYear: string;
  pages: number;
  price: number;
  originalPrice: number;
  quantity: number;
  status: "INACTIVE" | "ACTIVE";
  seriesId: number | undefined;
  isbn: string;
  coverImages: ImageProductRequest[];
  description: string;
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
  publisherId: number | null;
  seriesId: number | null;
  urlImageDefault: string;
  description: string;
  productGenres: ProductGenreResponse[] | [];
  productAuthors: ProductAuthorResponse[] | [];
  coverImages: ProductImageResponse[] | [];
}
export interface ProductGenreResponse {
  id: number;
  name: string;
}
export interface ProductAuthorResponse {
  id: number;
  name: string;
}

export interface ProductImageResponse {
  url: string;
  isThumbnail: boolean;
}

export interface ImageProductRequest {
  file?: File | null;
  url?: string | null;
  isThumbnail: boolean;
}