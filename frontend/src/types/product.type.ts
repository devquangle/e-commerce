import type { ImageProductRequest } from "./image";

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

  coverImages: ImageProductRequest[];
  description: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  originalPrice: number;
  price: number;
  quantity: number;
  weight: number;
  publishYear: string;
  pages: number;
}




