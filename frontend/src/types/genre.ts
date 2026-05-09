export const GenreStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
  UNKNOWN: "UNKNOWN",
} as const;

export type GenreStatus =
  typeof GenreStatus[keyof typeof GenreStatus];

export const GenreStatusLabel: Record<GenreStatus, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngừng hoạt động",
  DELETED: "Đã xóa",
  UNKNOWN: "Không xác định",
};

export interface GenreResponse {
  id: number;
  name: string;
  status: GenreStatus;
  totalProduct: number;
}


export interface GenreRequest {
  name: string;
  status: GenreStatus;
}



export type options = {
  keyword?: string;
  page?: number;
  size?: number;
};