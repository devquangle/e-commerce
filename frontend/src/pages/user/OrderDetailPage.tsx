import { useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useOrderDetail } from "@/modules/user/order/hooks/useOrder";
import { OrderItemCard } from "@/modules/user/order/components/OrderItemCard";
import { OrderDetailSkeleton } from "@/modules/user/order/components/OrderDetailSkeleton";
import { CancelOrderModal } from "@/modules/user/order/components/CancelOrderModal";
import { ChangeAddressModal } from "@/modules/user/order/components/ChangeAddressModal";
import Button from "@/components/common/Button";
import { AlertCircle, ArrowLeft, FileText } from "lucide-react";
import {
  OrderStatusColor,
  OrderStatusMapping,
  PaymentMethodMapping,
  PaymentStatusMapping,
} from "@/modules/user/order/types/order.type";
import { formatMoney } from "@/utils/number.utils";

interface OrderDetailPageProps {
  backPath?: string;
}

export default function OrderDetailPage({ backPath }: OrderDetailPageProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const orderCode =
    searchParams.get("orderCode") ||
    location.state?.orderCode ||
    location.state?.order?.orderCode;

  const resolvedBackPath =
    backPath ||
    (location.pathname.startsWith("/admin")
      ? "/admin/orders"
      : "/account/orders");

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const {
    data: orderDetail,
    isLoading,
    isError,
    error,
  } = useOrderDetail(orderCode ?? undefined);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !orderDetail) {
    return (
      <div className="flex-1 p-6 text-center text-red-500 font-medium min-h-screen space-y-4">
        <p>{error ? error.message : "Không tìm thấy đơn hàng"}</p>
        <Button
          color="secondary"
          size="md"
          icon={ArrowLeft}
          onClick={() => navigate(resolvedBackPath)}
        >
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    );
  }

  const { orderInfo, items } = orderDetail;

  const statusColor =
    OrderStatusColor[orderInfo.status] || "bg-gray-100 text-gray-700";
  const statusLabel = OrderStatusMapping[orderInfo.status] || orderInfo.status;
  const paymentMethodLabel =
    PaymentMethodMapping[orderInfo.paymentMethod] || orderInfo.paymentMethod;
  const paymentStatusLabel =
    PaymentStatusMapping[orderInfo.paymentStatus] || orderInfo.paymentStatus;

  // Tính toán các thông số tài chính cho Card Footer (Tóm tắt đơn hàng)
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalOriginal = items.reduce(
    (acc, item) =>
      acc +
      (item.originalPrice > 0 ? item.originalPrice : item.price) *
        item.quantity,
    0,
  );
  const subtotalSelling = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const productDiscount = Math.max(0, subtotalOriginal - subtotalSelling);
  const voucherDiscount = orderInfo.voucherAmount || 0;
  const totalDiscount = productDiscount + voucherDiscount;
  const shippingFee = orderInfo.shippingFee || 0;
  const grandTotal = orderInfo.total;

  const hasCancelReason = Boolean(
    orderInfo.cancel && orderInfo.cancel.trim() !== "",
  );
  const hasNote = Boolean(orderInfo.noted && orderInfo.noted.trim() !== "");

  return (
    <div className="flex-1 p-2 flex flex-col min-h-full">
      <div className="flex justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Button
            color="secondary"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate(resolvedBackPath)}
          >
            Quay lại
          </Button>
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết đơn hàng {orderInfo.orderCode}
          </h2>
        </div>
      </div>

      {/* ===== INFO ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">👤 Khách hàng</h3>
          <p className="font-semibold text-gray-900">{orderInfo.fullName}</p>
          <p className="text-gray-700">{orderInfo.phone}</p>
          <p className="text-gray-500">{orderInfo.streetFull}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">📦 Đơn hàng</h3>
          <p>Ngày tạo: {orderInfo.createdAt}</p>
          <p>Thanh toán: {paymentMethodLabel}</p>
          <p>TT thanh toán: {paymentStatusLabel}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">🚦 Trạng thái</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
          >
            {statusLabel}
          </span>

          <p className="mt-4 text-lg font-semibold text-red-600">
            Tổng tiền: {formatMoney(orderInfo.total)}
          </p>
        </div>
      </div>

      {/* ===== CANCELLATION REASON & NOTE CARDS (HIỂN THỊ PHÍA TRÊN SẢN PHẨM - COL 12) ===== */}
      {(hasCancelReason || hasNote) && (
        <div className="space-y-3 mt-4">
          {/* Card Lý do hủy đơn */}
          {hasCancelReason && (
            <div className="bg-red-50/80 border border-red-200/80 rounded-xl p-4 flex items-start gap-3 text-red-900 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="font-bold text-sm text-red-950 flex items-center gap-2">
                  🚫 Lý do hủy đơn hàng
                </h3>
                <p className="text-sm text-red-800 leading-relaxed font-medium">
                  {orderInfo.cancel}
                </p>
              </div>
            </div>
          )}

          {/* Card Ghi chú đơn hàng */}
          {hasNote && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-2xs">
              <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                  📝 Ghi chú đơn hàng
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  {orderInfo.noted}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== PRODUCTS ===== */}
      <div className="bg-white p-4 rounded-lg border my-5 space-y-4">
        <h3 className="font-medium text-lg">🛒 Sản phẩm</h3>

        <div className="space-y-3">
          {items.map((item) => (
            <OrderItemCard
              key={item.orderItemId}
              item={item}
              orderStatus={orderInfo.status}
            />
          ))}
        </div>

        {/* Card Footer: Tóm tắt đơn hàng */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-col items-end text-sm">
          <div className="w-full sm:w-80 space-y-2.5">
            <h4 className="font-bold text-base text-slate-900 pb-0.5">
              Tóm tắt đơn hàng
            </h4>

            {/* Sách đã chọn */}
            <div className="flex justify-between items-center text-slate-600">
              <span>Sách đã chọn</span>
              <span className="font-bold text-slate-900">
                {totalQuantity} cuốn
              </span>
            </div>

            {/* Tạm tính */}
            <div className="flex justify-between items-center text-slate-600">
              <span>Tạm tính</span>
              <span className="font-bold text-slate-900">
                {formatMoney(subtotalOriginal)}
              </span>
            </div>

            {/* Giảm giá */}
            {totalDiscount > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Giảm giá</span>
                  <span className="font-bold text-emerald-600">
                    -{formatMoney(totalDiscount)}
                  </span>
                </div>

                {/* Chi tiết giảm giá Sản phẩm & Voucher */}
                <div className="border-l-2 border-slate-200/80 pl-3 ml-1 space-y-1 text-xs text-slate-500">
                  {productDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Sản phẩm</span>
                      <span className="font-medium text-emerald-600">
                        -{formatMoney(productDiscount)}
                      </span>
                    </div>
                  )}
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Voucher</span>
                      <span className="font-medium text-emerald-600">
                        -{formatMoney(voucherDiscount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Phí vận chuyển */}
            <div className="flex justify-between items-center text-slate-600">
              <span>Phí vận chuyển</span>
              <span className="font-medium text-slate-900">
                {shippingFee > 0 ? formatMoney(shippingFee) : "Miễn phí"}
              </span>
            </div>

            {/* Dòng phân cách nét đứt */}
            <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-base">
                Tổng cộng
              </span>
              <span className="font-bold text-red-600 text-xl tabular-nums">
                {formatMoney(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ACTION ===== */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {orderInfo.status === "PENDING" && (
          <>
            <Button
              color="warning"
              size="md"
              onClick={() => setIsAddressOpen(true)}
            >
              Đổi địa chỉ
            </Button>
            <Button
              color="danger"
              size="md"
              onClick={() => setIsCancelOpen(true)}
            >
              Huỷ đơn
            </Button>
          </>
        )}
        <Button
          color="secondary"
          size="md"
          icon={ArrowLeft}
          onClick={() => navigate(resolvedBackPath)}
        >
          Quay lại
        </Button>
      </div>

      <CancelOrderModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        orderCode={orderInfo.orderCode}
      />

      <ChangeAddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        order={orderInfo}
      />
    </div>
  );
}
