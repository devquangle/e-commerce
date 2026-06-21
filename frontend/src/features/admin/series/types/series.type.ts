import type { BaseStatus } from "@/types/status";

export interface SeriesRequest {
  name: string;
  description: string;
  status: BaseStatus;
}

export interface SeriesResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: BaseStatus;
}


export interface SeriesWithProductCountResponse {
  id: number;
  name: string;
  slug: string;
  bookCount: number | 0;
}
