export interface AuthorResponse {
  id: number;
  name: string;
  displayName: string;
}

export interface AuthorRes {
  id: number;
  name: string;
  urlImage: string;
  description?: string;
  bio?: string;
}
export interface AuthorReq {
  name: string;
  urlImage?: string;
  description?: string;
  bio?: string;
}