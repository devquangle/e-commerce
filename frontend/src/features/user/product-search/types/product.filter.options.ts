export type ProductFilterOptions = {
  keyword?: string;
  status?: string;
  genres?: string[];
  authors?: string[];
  publisher?: string;
  series?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  size?: number;
  sort?: SortType;
};

export type SortType =
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "SOLD_COUNT"
  | "RATING"
  | "NEWEST"| "";

export const SORT_OPTIONS: {
  value: SortType;
  label: string;
}[] = [
  {
    value: "PRICE_ASC",
    label: "Giá: Thấp đến Cao",
  },
  {
    value: "PRICE_DESC",
    label: "Giá: Cao đến Thấp",
  },
  {
    value: "SOLD_COUNT",
    label: "Bán Chạy",
  },
  {
    value: "RATING",
    label: "Đánh Giá Cao",
  },
  {
    value: "NEWEST",
    label: "Mới Nhất",
  },
    {
    value: "",
    label: "Tất cả",
  },
];
