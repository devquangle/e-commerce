import type { BaseStatus } from "@/types/status";

export interface GenreResponse {
  id: number;
  name: string;
  slug: string;
  status: BaseStatus;
  urlImage: string;
}

export interface GenreRequest {
  name: string;
  status: BaseStatus;
  previewImageUrl: string;
}
export interface GenreWithProductCountResponse {
  id: number;
  name: string;
  slug: string;
  urlImage: string;
  bookCount: number | 0;
}

export interface GenreFilterRequest {
  keyword?: string;
  status?: BaseStatus;
  page?: number;
  size?: number;
}
