export const GenreStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export type GenreStatus =
  typeof GenreStatus[keyof typeof GenreStatus];

export const GenreStatusLabel: Record<GenreStatus, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngừng hoạt động",
  DELETED: "Đã xóa",
};

export interface GenreResponse {
  id: number;
  name: string;
  status: GenreStatus;
  urlImage: string;
  totalProduct: number;
}


export interface GenreRequest {
  name: string;
  status: GenreStatus;
  previewImageUrl: string;
  
}



