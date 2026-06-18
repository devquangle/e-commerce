import type { BaseStatus } from "@/types/status";

export interface AuthorResponse {
  id: number;
  name: string;
  wikibaseItem: string;
  urlImage: string;
  description: string;
  urlBio: string;
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
