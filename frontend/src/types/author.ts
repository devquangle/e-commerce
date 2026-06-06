import type { BaseStatus } from "./status";

export interface AuthorResponse {
  id: number;
  name: string;
  displayName: string;
}

export interface AuthorRes {
  id: number;
  name: string;
  wikibaseItem: string;
  urlImage: string;
  description: string;
  urlBio: string;
  status: BaseStatus;
}
export interface AuthorReq {
  name: string;
  urlImage?: string;
  description?: string;
  bio?: string;
}
