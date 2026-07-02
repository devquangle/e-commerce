export type ReviewStatus = "Đã duyệt" | "Chờ duyệt" | "Bị báo cáo";

export type ReviewItem = {
  id: string;
  user: string;
  product: string;
  orderCode: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  purchased: boolean;
  createdAt: string;
  adminReply?: string;
};
