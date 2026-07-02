import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import type { ReviewItem } from "@/modules/admin/review/types/review.type";
import ReviewMetrics from "@/modules/admin/review/components/ReviewMetrics";
import ReviewFilter from "@/modules/admin/review/components/ReviewFilter";
import ReviewFeed from "@/modules/admin/review/components/ReviewFeed";

const mockReviews: ReviewItem[] = [
  {
    id: "RV1001",
    user: "Hoàng Anh",
    product: "Đắc Nhân Tâm",
    orderCode: "OD2201",
    rating: 5,
    content: "Sách mới, đóng gói cực kỳ cẩn thận và giao hàng siêu nhanh. Rất hài lòng với dịch vụ chăm sóc khách hàng của shop!",
    status: "Đã duyệt",
    purchased: true,
    createdAt: "05/05/2026",
    adminReply: "Cảm ơn bạn đã tin tưởng và ủng hộ shop. Chúc bạn có những giây phút đọc sách thật bổ ích!",
  },
  {
    id: "RV1002",
    user: "Minh Thu",
    product: "Nhà Giả Kim",
    orderCode: "OD2197",
    rating: 4,
    content: "Nội dung rất hay và ý nghĩa. Tuy nhiên góc sách hơi bị cong nhẹ một chút do quá trình vận chuyển. Shop nên bọc chống sốc kỹ hơn nhé.",
    status: "Chờ duyệt",
    purchased: true,
    createdAt: "04/05/2026",
  },
  {
    id: "RV1003",
    user: "Quốc Bảo",
    product: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    orderCode: "OD2184",
    rating: 2,
    content: "Sách bị trầy xước bìa khá nhiều khi nhận được, mong shop kiểm tra kỹ hàng trước khi đóng gói gửi đi.",
    status: "Bị báo cáo",
    purchased: true,
    createdAt: "02/05/2026",
  },
];

export default function Review() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reviews, setReviews] = useState<ReviewItem[]>(mockReviews);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (!review.purchased) return false;

      const searchValue = search.trim().toLowerCase();
      const matchSearch =
        !searchValue ||
        review.user.toLowerCase().includes(searchValue) ||
        review.product.toLowerCase().includes(searchValue) ||
        review.orderCode.toLowerCase().includes(searchValue);

      const matchRating =
        ratingFilter === "ALL"
          ? true
          : ratingFilter === "LTE3"
            ? review.rating <= 3
            : review.rating === Number(ratingFilter);

      const matchStatus = statusFilter === "ALL" ? true : review.status === statusFilter;

      return matchSearch && matchRating && matchStatus;
    });
  }, [reviews, search, ratingFilter, statusFilter]);

  const handleReplyChange = (reviewId: string, value: string) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  const handleReplySubmit = (reviewId: string) => {
    const draft = replyDrafts[reviewId]?.trim();
    if (!draft) return;

    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              adminReply: draft,
            }
          : review
      )
    );

    setReplyDrafts((prev) => ({
      ...prev,
      [reviewId]: "",
    }));
  };

  const handleResetFilter = () => {
    setSearch("");
    setRatingFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <section className="space-y-6 p-4 flex-1 flex flex-col gap-4">
      {/* HEADER WITH card-custom */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between card-custom p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <MessageSquare size={22} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản lý đánh giá</h1>
          </div>
          <p className="text-sm text-slate-500">
            Duyệt bình luận đánh giá sách từ khách hàng và gửi phản hồi chăm sóc chính thức.
          </p>
        </div>
      </div>

      {/* METRICS CARDS */}
      <ReviewMetrics
        averageRating={4.5}
        pendingCount={1}
        reportedCount={1}
      />

      {/* FILTER & FEED CONTAINER WITH card-custom */}
      <div className="card-custom p-4">
        <ReviewFilter
          search={search}
          onSearchChange={setSearch}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onReset={handleResetFilter}
        />

        <ReviewFeed
          filteredReviews={filteredReviews}
          replyDrafts={replyDrafts}
          onReplyChange={handleReplyChange}
          onReplySubmit={handleReplySubmit}
        />
      </div>
    </section>
  );
}
