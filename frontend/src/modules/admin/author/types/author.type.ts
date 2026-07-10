import type { BaseStatus } from "@/types/status";

export interface AuthorResponse {
  id: number;
  name: string;
  wikibaseItem: string;
  urlImage: string;
  description: string;
  urlBio: string;
  slug: string;
  status: BaseStatus;
}
export interface AuthorRequest {
  name: string;
  wikibaseItem: string;
  urlImage: string;
  urlBio: string;
  extract: string;
  status: BaseStatus;
}

export interface AuthorWithProductCountResponse {
  id: number;
  name: string;
  slug: string;
  urlImage: string;
  description: string;
  bookCount: number | 0;
}

export interface AuthorFilterRequest {
  keyword?: string;
  status?: BaseStatus;
  page?: number;
  size?: number;
}
