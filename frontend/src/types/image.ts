export interface ImageGenrenResponse {
  imageUrl: string;
}
export interface ImageGenreRequest {
  input: string;
}

export interface ImageProductRequest {
  file?: File | null;
  url?: string | null;
  isThumbnail: boolean;
}

export interface ImageProductResponse {
  url: string;
  isThumbnail: boolean;
}

export interface UrlImageResponse {
  urlImage: string;
}
