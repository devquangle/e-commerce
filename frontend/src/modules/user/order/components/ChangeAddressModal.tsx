import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import {
  MapPin,
  ShoppingBag,
  BookUser,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { showWarningToast } from "@/utils/toastUtil";
import { useForm, useWatch } from "react-hook-form";
import {
  useProvinces,
  useDistricts,
  useWards,
} from "@/modules/user/address/hooks/useAddressGHN";
import { useAddresses } from "@/modules/user/address/hooks/useAddress";
import { useChangeAddress, useOrderDetail } from "@/modules/user/order/hooks/useOrder";
import { useShippingFee } from "@/modules/user/payment/hooks/useGhn";
import { formatMoney } from "@/utils/number.utils";
import type { OrderResponse, OrderItemResponse } from "../types/order.type";

interface ChangeAddressFormData {
  fullName: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  street: string;
}

interface ChangeAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  items?: OrderItemResponse[];
  onSuccess?: () => void;
}

export function ChangeAddressModal({
  isOpen,
  onClose,
  order,
  items: propItems,
  onSuccess,
}: ChangeAddressModalProps) {
  const changeAddressMutation = useChangeAddress();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
  } = useForm<ChangeAddressFormData>();

  /* ================= FETCH SAVED ADDRESSES & ORDER DETAIL ================= */
  const { data: savedAddresses = [] } = useAddresses();
  const { data: orderDetail } = useOrderDetail(
    isOpen && order ? order.orderCode : undefined
  );

  const orderItems = propItems || orderDetail?.items || [];

  /* ================= WATCH ================= */
  const fullName = useWatch({ control, name: "fullName" });
  const phone = useWatch({ control, name: "phone" });
  const provinceId = useWatch({ control, name: "provinceId" });
  const districtId = useWatch({ control, name: "districtId" });
  const wardCode = useWatch({ control, name: "wardCode" });
  const street = useWatch({ control, name: "street" });

  const [selectedSavedId, setSelectedSavedId] = useState<number | null>(null);
  const [prevOrderCode, setPrevOrderCode] = useState<string | null>(null);

  // Reset selectedSavedId trực tiếp trong render body khi mở Modal
  const currentOrderKey = isOpen && order ? order.orderCode : null;
  if (currentOrderKey !== prevOrderCode) {
    setPrevOrderCode(currentOrderKey);
    setSelectedSavedId(null);
  }

  /* ================= GHN DATA & SHIPPING FEE ================= */
  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(provinceId);
  const { data: wards = [] } = useWards(districtId);

  // Sync thông tin địa chỉ từ order khi modal mở hoặc order thay đổi
  useEffect(() => {
    if (order && isOpen) {
      reset({
        fullName: order.fullName || "",
        phone: order.phone || "",
        street: order.street || "",
        provinceId: order.provinceId,
        districtId: order.districtId,
        wardCode: order.wardCode,
      });
    }
  }, [order, isOpen, reset]);

  // Tính tổng trọng lượng sản phẩm
  const totalWeight = orderItems.reduce(
    (sum, i) => sum + (i.productInfo?.weight || 200) * i.quantity,
    0
  );

  // Gọi API GHN tính phí ship cho địa chỉ mới
  const shippingFeeRequest =
    districtId && wardCode
      ? {
          toDistrictId: Number(districtId),
          toWardCode: String(wardCode).trim(),
          weight: Math.max(200, totalWeight),
        }
      : null;

  const { data: fetchedNewShippingFee } = useShippingFee(shippingFeeRequest);

  const oldShippingFee = order?.shippingFee || 0;
  const currentShippingFee =
    fetchedNewShippingFee !== undefined ? fetchedNewShippingFee : oldShippingFee;

  // Tính toán Tóm tắt đơn hàng
  const totalQuantity = orderItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalOriginal = orderItems.reduce(
    (acc, item) =>
      acc + (item.originalPrice > 0 ? item.originalPrice : item.price) * item.quantity,
    0
  );
  const subtotalSelling = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const productDiscount = Math.max(0, subtotalOriginal - subtotalSelling);
  const voucherDiscount = order?.voucherAmount || 0;
  const totalDiscount = productDiscount + voucherDiscount;
  const grandTotal = subtotalSelling - voucherDiscount + currentShippingFee;

  // Kiểm tra nếu địa chỉ mới giống y chang địa chỉ cũ
  const isAddressIdentical = Boolean(
    selectedSavedId !== null &&
      order &&
      fullName === order.fullName &&
      phone === order.phone &&
      Number(provinceId) === Number(order.provinceId) &&
      Number(districtId) === Number(order.districtId) &&
      String(wardCode) === String(order.wardCode) &&
      street?.trim() === order.street?.trim()
  );

  // Tên địa chỉ đã chọn để hiển thị xem trước
  const selectedProvinceName =
    provinces.find((p) => p.ProvinceID === provinceId)?.ProvinceName || "";
  const selectedDistrictName =
    districts.find((d) => d.DistrictID === districtId)?.DistrictName || "";
  const selectedWardName =
    wards.find((w) => w.WardCode === wardCode)?.WardName || "";

  const fullAddressPreview = [
    street,
    selectedWardName,
    selectedDistrictName,
    selectedProvinceName,
  ]
    .filter(Boolean)
    .join(", ");

  // Set district once districts options are loaded and contain the required district
  useEffect(() => {
    if (order && districts.some((d) => d.DistrictID === order.districtId)) {
      setValue("districtId", order.districtId);
    }
  }, [order, districts, setValue]);

  // Set ward once wards options are loaded and contain the required ward
  useEffect(() => {
    if (order && wards.some((w) => w.WardCode === order.wardCode)) {
      setValue("wardCode", order.wardCode);
    }
  }, [order, wards, setValue]);

  if (!order) return null;

  const onSubmit = () => {
    if (isAddressIdentical) {
      showWarningToast("Địa chỉ mới chọn trùng khớp hoàn toàn với địa chỉ ban đầu của đơn hàng!");
      return;
    }

    if (!selectedSavedId) {
      showWarningToast("Vui lòng chọn 1 địa chỉ từ sổ địa chỉ!");
      return;
    }

    changeAddressMutation.mutate(
      {
        orderCode: order.orderCode,
        addressId: selectedSavedId,
      },
      {
        onSuccess: () => {
          onClose();
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      title="Thay đổi địa chỉ giao hàng"
      confirmText={changeAddressMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
      cancelText="Hủy"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-base">
        {/* Banner thông tin đơn hàng (Layout 12) */}
        <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50/70 rounded-2xl border border-blue-200/60 text-blue-900 shadow-2xs">
          <MapPin size={24} className="text-blue-600 shrink-0" />
          <div className="text-base space-y-1">
            <p className="font-bold text-blue-950 text-base">
              Cập nhật địa chỉ nhận hàng cho đơn #{order.orderCode}
            </p>
            <p className="text-blue-800 text-sm leading-relaxed">
              Lưu ý: Bạn có thể chọn từ sổ địa chỉ đã lưu bên dưới để cập nhật địa chỉ giao hàng. Phí vận chuyển có thể cao hoặc thấp hơn tùy vào địa chỉ bạn nhận hàng.
            </p>
          </div>
        </div>

        {/* THỨ TỰ BỐ CỤC CHUẨN: 12 - 12 - 6/6 - 12 */}
        <div className="space-y-4">
          {/* 1. SỔ ĐỊA CHỈ ĐÃ LƯU (LAYOUT 12) */}
          {savedAddresses.length > 0 ? (
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
              <div className="flex justify-between items-center text-base font-bold text-slate-800 border-b border-slate-200/60 pb-2">
                <span className="flex items-center gap-2 text-base">
                  <BookUser size={20} className="text-blue-600" />
                  Sổ địa chỉ đã lưu
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedSavedId === addr.id;

                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        setSelectedSavedId(addr.id);
                        setValue("fullName", addr.fullName, { shouldValidate: true });
                        setValue("phone", addr.phone, { shouldValidate: true });
                        setValue("street", addr.street, { shouldValidate: true });
                        if (addr.provinceId) {
                          setValue("provinceId", addr.provinceId, { shouldValidate: true });
                        }
                        if (addr.districtId) {
                          setValue("districtId", addr.districtId, { shouldValidate: true });
                        }
                        if (addr.wardCode) {
                          setValue("wardCode", addr.wardCode, { shouldValidate: true });
                        }
                      }}
                      className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 shadow-2xs"
                          : "border-slate-200/80 bg-white hover:border-blue-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-base text-slate-900 line-clamp-1">
                              {addr.fullName}
                            </span>
                            <span className="text-sm text-slate-600 font-medium">
                              ({addr.phone})
                            </span>
                            {addr.default && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
                            {addr.streetFull || addr.street}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-base">
              Không tìm thấy địa chỉ đã lưu nào trong sổ địa chỉ của bạn.
            </div>
          )}

          {/* 2. SẢN PHẨM (LAYOUT 12 TRÀN VIỀN) */}
          {orderItems.length > 0 && (
            <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70 space-y-3">
              <div className="flex justify-between items-center text-base font-bold text-slate-900 pb-1.5 border-b border-slate-200/60">
                <span className="flex items-center gap-2 text-base">
                  <ShoppingBag size={20} className="text-blue-600" />
                  Sản phẩm
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                {orderItems.map((item) => {
                  const product = item.productInfo;
                  const itemOrigPrice =
                    item.originalPrice > item.price
                      ? item.originalPrice
                      : product?.price || item.price;
                  const hasDiscount = itemOrigPrice > item.price;

                  return (
                    <div
                      key={item.orderItemId || product?.id}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs"
                    >
                      <img
                        src={product?.urlImage}
                        alt={product?.name}
                        className="w-12 h-14 object-cover rounded-md border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h5 className="text-base font-bold text-slate-900 line-clamp-1">
                          {product?.name}
                        </h5>
                        <div className="flex items-center justify-end gap-2 text-base">
                          {hasDiscount && (
                            <span className="line-through text-slate-400 text-sm font-normal">
                              {formatMoney(itemOrigPrice)}
                            </span>
                          )}
                          <span className="font-bold text-red-600 text-base">
                            {formatMoney(item.price)} x {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. CARD SO SÁNH ĐỊA CHỈ CỦ / ĐỊA CHỈ MỚI (LAYOUT 6 - 6 SONG SONG) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CARD ĐỊA CHỈ CỦ (BAN ĐẦU) */}
            <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/90 space-y-2 text-base">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                  <MapPin size={17} className="text-slate-500 shrink-0" />
                  Địa chỉ cũ
                </h4>
                <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                  Ban đầu
                </span>
              </div>
              <div className="pt-1 space-y-1">
                <p className="font-bold text-slate-900 text-base">
                  {order.fullName} <span className="font-medium text-slate-600 text-sm">({order.phone})</span>
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {order.streetFull || order.street}
                </p>
              </div>
            </div>

            {/* CARD ĐỊA CHỈ MỚI (THAY ĐỔI DỰ KIẾN) */}
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2 text-base">
              <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5">
                <h4 className="font-bold text-blue-950 text-base flex items-center gap-1.5">
                  <MapPin size={17} className="text-blue-600 shrink-0" />
                  Địa chỉ mới
                </h4>
                <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md">
                  Mới chọn
                </span>
              </div>
              <div className="pt-1 space-y-1">
                {selectedSavedId !== null && (fullName || phone || fullAddressPreview) ? (
                  <>
                    <p className="font-bold text-blue-950 text-base">
                      {fullName || "Chưa nhập họ tên"}{" "}
                      {phone && <span className="font-medium text-blue-800 text-sm">({phone})</span>}
                    </p>
                    <p className="text-sm text-blue-900/90 leading-relaxed">
                      {fullAddressPreview || "Chưa chọn đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã..."}
                    </p>
                  </>
                ) : (
                  <p className="text-blue-500 italic text-sm pt-1">
                    Vui lòng chọn địa chỉ từ sổ địa chỉ bên trên...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* THẺ BÁO LỖI NẾU ĐỊA CHỈ MỚI GIỐNG Y TRANG ĐỊA CHỈ CỦ */}
          {isAddressIdentical && (
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-900 text-base font-medium animate-in fade-in duration-200 shadow-2xs">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-950 text-base">Địa chỉ không thay đổi</p>
                <p className="text-sm text-amber-800/90 leading-relaxed">
                  Địa chỉ mới vừa chọn trùng khớp hoàn toàn với địa chỉ ban đầu của đơn hàng. Vui lòng chọn địa chỉ khác để thay đổi.
                </p>
              </div>
            </div>
          )}

          {/* 4. TÓM TẮT ĐƠN HÀNG (LAYOUT 12 TRÀN VIỀN DƯỚI CÙNG) */}
          {orderItems.length > 0 && (
            <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70 space-y-3 text-base">
              <h4 className="font-bold text-base text-slate-900 pb-1 border-b border-slate-200/60">
                Tóm tắt đơn hàng
              </h4>

              {/* Sách đã chọn */}
              <div className="flex justify-between items-center text-slate-700 pt-1">
                <span>Sách đã chọn</span>
                <span className="font-bold text-slate-900">
                  {totalQuantity} cuốn
                </span>
              </div>

              {/* Tạm tính */}
              <div className="flex justify-between items-center text-slate-700">
                <span>Tạm tính</span>
                <span className="font-bold text-slate-900">
                  {formatMoney(subtotalOriginal)}
                </span>
              </div>

              {/* Giảm giá */}
              {totalDiscount > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Giảm giá</span>
                    <span className="font-bold text-emerald-600">
                      -{formatMoney(totalDiscount)}
                    </span>
                  </div>

                  <div className="border-l-2 border-slate-200/80 pl-3 ml-1 space-y-1 text-sm text-slate-600">
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

              {/* Phí vận chuyển (Hiển thị cả phí cũ và phí mới) */}
              <div className="flex justify-between items-center text-slate-700">
                <span>Phí vận chuyển</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400 line-through text-sm">
                    {oldShippingFee > 0 ? formatMoney(oldShippingFee) : "0đ"}
                  </span>
                  <ArrowRight size={14} className="text-slate-400" />
                  <span className="text-slate-900 font-bold text-base">
                    {currentShippingFee > 0 ? formatMoney(currentShippingFee) : "Miễn phí"}
                  </span>
                </div>
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
          )}
        </div>
      </form>
    </Modal>
  );
}
