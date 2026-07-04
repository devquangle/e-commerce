export interface ProductResponse extends ProductSoldCountResponse {
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
  description: string;
  language?: string;
  productPublisher: ProductPublisherResponse;
  productSeries: ProductSeriesResponse | null;
  productGenres: ProductGenreResponse[] | [];
  productAuthors: ProductAuthorResponse[] | [];
  coverImages: ProductImageResponse[] | [];
}
export interface ProductSoldCountResponse {
  soldCount: number;
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
