import type { BaseStatus } from "@/types/status";


export interface GenreResponse {
  id: number;
  name: string;
  status: BaseStatus;
  urlImage: string;
  totalProduct: number;
}


export interface GenreRequest {
  name: string;
  status: BaseStatus;
  previewImageUrl: string;
  
}



