import { useState, useMemo } from "react";
import { Loader2, Check, Search, Calendar, AlertCircle, Lock } from "lucide-react";
import type { VoucherUserResponse } from "@/modules/admin/voucher/types/voucher.type";
import Modal from "@/components/common/Modal";
import { useGetVoucherForUser } from "@/modules/admin/voucher/hooks/useVoucher";
import { formatMoney } from "@/utils/number.utils";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedCoupon: VoucherUserResponse | null;
  onSelect: (coupon: VoucherUserResponse) => void;
  /** Tạm tính hiện tại (trước khi giảm giá) để kiểm tra điều kiện minOrderValue */
  subtotal?: number;
}

export default function VoucherModal({
  isOpen,
  onClose,
  appliedCoupon,
  onSelect,
  subtotal = 0,
}: VoucherModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: vouchers = [], isLoading, isError } = useGetVoucherForUser();

  const filteredVouchers = useMemo(() => {
    if (!searchTerm.trim()) return vouchers;
    const term = searchTerm.toLowerCase();
    return vouchers.filter(
      (v) =>
        v.code.toLowerCase().includes(term) ||
        v.name.toLowerCase().includes(term)
    );
  }, [vouchers, searchTerm]);


  /** Dòng mô tả công thức giảm giá */
  const formatFormula = (voucher: VoucherUserResponse) => {
    if (voucher.discountValue <= 100) {
      return `Giảm ${voucher.discountValue}%${
        voucher.maxDiscountValue > 0
          ? ` (tối đa ${formatMoney(voucher.maxDiscountValue)})`
          : ""
      }`;
    }
    return `Giảm cố định ${formatMoney(voucher.discountValue)}`;
  };


  const isEligible = (voucher: VoucherUserResponse) =>
    voucher.minOrderValue <= 0 || subtotal >= voucher.minOrderValue;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Danh sách mã giảm giá của bạn"
      cancelText="Đóng"
      size="lg"
    >
      <div className="space-y-4">
        {/* Tạm tính */}
        {subtotal > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm">
            <span className="text-slate-500 font-medium">Tạm tính của bạn:</span>
            <span className="font-bold text-slate-900 tabular-nums">
              {formatMoney(subtotal)}
            </span>
          </div>
        )}

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm mã giảm giá..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none uppercase font-semibold transition"
          />
        </div>

        {/* Danh sách Voucher dạng Grid 2 cột */}
        <div className="max-h-[420px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Loader2 size={24} className="animate-spin mb-2 text-red-600" />
              <p className="text-sm font-medium">Đang tải danh sách mã giảm giá...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <AlertCircle size={24} className="mb-2 text-amber-500" />
              <p className="text-sm font-medium">Không thể lấy danh sách voucher.</p>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
              <p className="text-sm font-medium">
                {searchTerm
                  ? `Không tìm thấy voucher phù hợp với "${searchTerm}"`
                  : "Hiện chưa có voucher khả dụng nào."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredVouchers.map((voucher) => {
                const isSelected = appliedCoupon?.code === voucher.code;
                const eligible = isEligible(voucher);
                const notEligibleMsg =
                  !eligible && voucher.minOrderValue > 0
                    ? `Cần đơn từ ${formatMoney(voucher.minOrderValue)} (còn thiếu ${formatMoney(voucher.minOrderValue - subtotal)})`
                    : null;

                return (
                  <div
                    key={voucher.id || voucher.code}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between gap-3 ${
                      !eligible
                        ? "border-slate-200 bg-slate-50/60 opacity-70"
                        : isSelected
                        ? "border-red-600 bg-red-50/40"
                        : "border-slate-200/80 bg-white hover:border-red-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`font-bold tracking-wide px-2 py-0.5 rounded-md text-xs border ${
                              !eligible
                                ? "bg-slate-100 text-slate-400 border-slate-200"
                                : "bg-slate-100 text-slate-800 border-slate-200"
                            }`}
                          >
                            {voucher.code}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              eligible ? "text-red-600" : "text-slate-400"
                            }`}
                          >
                            {formatFormula(voucher)}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                          {voucher.name}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!eligible) return;
                          onSelect(voucher);
                          onClose();
                        }}
                        disabled={isSelected || !eligible}
                        title={notEligibleMsg ?? undefined}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                          !eligible
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : isSelected
                            ? "bg-green-600 text-white cursor-default"
                            : "bg-red-600 text-white hover:bg-red-700 active:scale-95 cursor-pointer"
                        }`}
                      >
                        {!eligible ? (
                          <>
                            <Lock size={12} />
                            Chưa đủ
                          </>
                        ) : isSelected ? (
                          <>
                            <Check size={14} />
                            Đã dùng
                          </>
                        ) : (
                          "Áp dụng"
                        )}
                      </button>
                    </div>

                    {/* Footer: điều kiện & hạn */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-auto">
                      <span
                        className={
                          !eligible ? "text-amber-600 font-semibold" : ""
                        }
                      >
                        {voucher.minOrderValue > 0
                          ? `Đơn từ ${formatMoney(voucher.minOrderValue)}`
                          : "Không tối thiểu"}
                      </span>
                      {voucher.endDate && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar size={12} />
                          {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>

                    {/* Badge "Chưa đủ điều kiện" */}
                    {!eligible && notEligibleMsg && (
                      <p className="text-[10px] text-amber-600 font-medium -mt-1 leading-snug">
                        ⚠ {notEligibleMsg}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
