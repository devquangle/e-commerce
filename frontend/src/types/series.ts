import type { BaseStatus } from "./status";

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
