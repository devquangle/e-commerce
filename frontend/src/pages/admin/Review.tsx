import { useMemo, useState } from "react";

type ReviewStatus = "Đã duyệt" | "Chờ duyệt" | "Bị báo cáo";

type ReviewItem = {
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

const statusStyles: Record<ReviewStatus, string> = {
  "Đã duyệt": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Chờ duyệt": "bg-amber-50 text-amber-700 border-amber-200",
  "Bị báo cáo": "bg-red-50 text-red-700 border-red-200",
};

const mockReviews: ReviewItem[] = [
  {
    id: "RV1001",
    user: "Hoàng Anh",
    product: "Đắc Nhân Tâm",
    orderCode: "OD2201",
    rating: 5,
    content: "Sách mới, đóng gói cẩn thận và giao nhanh.",
    status: "Đã duyệt",
    purchased: true,
    createdAt: "05/05/2026",
    adminReply: "Cảm ơn bạn đã ủng hộ shop.",
  },
  {
    id: "RV1002",
    user: "Minh Thu",
    product: "Nhà Giả Kim",
    orderCode: "OD2197",
    rating: 4,
    content: "Nội dung hay nhưng góc sách hơi cong nhẹ.",
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
    content: "Sách bị trầy bìa, mong shop kiểm tra kỹ hơn.",
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

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đánh giá</h1>
          <p className="text-sm text-gray-500">
            Hiển thị đánh giá từ khách đã mua sách và phản hồi trực tiếp cho từng bình luận.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Tìm người mua, sách hoặc mã đơn..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 md:col-span-2"
          />
          <select
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          >
            <option value="ALL">Tất cả số sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="LTE3">3 sao trở xuống</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Bị báo cáo">Bị báo cáo</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredReviews.length === 0 ? (
            <p className="rounded-lg border border-dashed p-5 text-center text-sm text-gray-500">
              Không có đánh giá phù hợp bộ lọc.
            </p>
          ) : (
            filteredReviews.map((review) => (
              <article key={review.id} className="rounded-lg border p-4">
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">{review.user}</h3>
                    <p className="text-sm text-gray-500">
                      {review.product} - {review.rating} sao - Đơn {review.orderCode}
                    </p>
                    <p className="text-xs text-gray-400">Đánh giá ngày: {review.createdAt}</p>
                    <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                      Đã mua hàng
                    </span>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[review.status]}`}
                  >
                    {review.status}
                  </span>
                </div>

                <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{review.content}</p>

                <div className="mt-3 space-y-2">
                  {review.adminReply ? (
                    <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-medium text-emerald-700">Phản hồi của shop</p>
                      <p className="mt-1 text-sm text-emerald-900">{review.adminReply}</p>
                    </div>
                  ) : null}

                  <textarea
                    value={replyDrafts[review.id] ?? ""}
                    onChange={(event) => handleReplyChange(review.id, event.target.value)}
                    rows={3}
                    placeholder="Nhập phản hồi cho bình luận này..."
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleReplySubmit(review.id)}
                      className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Trả lời bình luận
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReplyChange(review.id, "")}
                      className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50"
                    >
                      Xóa nội dung
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
