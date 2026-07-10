export interface ProductRequest {
  name: string;
  authorIds: number[];
  publisherId: number | undefined;
  genreIds: number[];
  weight: number;
  publishYear: string;
  pages: number;
  language: string;
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
  originalPrice: number;
  price: number;
  quantity: number;
  weight: number;
  publishYear: string;
  pages: number;
  language?: string;
  status: string;
  genresName: string[] | [];
  authorsName: string[] | [];
  publisherName: string;
  seriesName: string;
  urlImageDefault: string;
}

export interface ProductDetailResponse {
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
  language: string;
  status: string;
  description: string;
  genreIds: number[] | [];
  authorIds: number[] | [];
  publisherId: number | null;
  seriesId: number | null;
  coverImages: ProductImageResponse[] | [];
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


export interface ProductSearchRequest {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}