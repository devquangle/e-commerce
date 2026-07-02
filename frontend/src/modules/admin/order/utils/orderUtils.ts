export const statusBadgeClass = (status: string) => {
  switch (status) {
    case "Đã giao":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Đang xử lý":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Chờ xác nhận":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Đã hủy":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};
