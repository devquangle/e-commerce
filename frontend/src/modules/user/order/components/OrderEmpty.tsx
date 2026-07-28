import { PackageX, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderEmptyProps {
  message?: string;
  description?: string;
  showShopButton?: boolean;
}

export function OrderEmpty({
  message = "Chưa có đơn hàng nào",
  description = "Bạn chưa có đơn hàng nào trong danh sách này. Hãy khám phá hàng ngàn cuốn sách hấp dẫn và đặt hàng ngay nhé!",
  showShopButton = true,
}: OrderEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-center my-4 space-y-4">
      {/* Container Icon dạng hình tròn mềm mại */}
      <div className="w-20 h-20 bg-blue-50/80 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
        <PackageX size={40} strokeWidth={1.75} />
      </div>

      {/* Thông điệp */}
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-bold text-slate-800">
          {message}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Nút bấm chuyển sang trang Mua sắm */}
      {showShopButton && (
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer mt-2"
        >
          <ShoppingBag size={18} />
          <span>Khám phá sản phẩm ngay</span>
        </Link>
      )}
    </div>
  );
}
