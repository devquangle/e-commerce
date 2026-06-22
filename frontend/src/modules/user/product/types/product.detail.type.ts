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
