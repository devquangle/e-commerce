import { useEffect, useState, useMemo } from "react";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import TextAreaField from "@/components/common/TextAreaField";
import SelectBox from "@/components/common/SelectedBox";
import {
  MapPin,
  ShoppingBag,
  BookUser,
  Check,
  Plus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  useProvinces,
  useDistricts,
  useWards,
} from "@/modules/user/address/hooks/useAddressGHN";
import { useAddresses } from "@/modules/user/address/hooks/useAddress";
import { useOrderDetail } from "@/modules/user/order/hooks/useOrder";
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
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedSavedId, setSelectedSavedId] = useState<number | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
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

      // Tìm địa chỉ khớp trong sổ địa chỉ đã lưu
      const matched = savedAddresses.find(
        (a) =>
          a.provinceId === order.provinceId &&
          a.districtId === order.districtId &&
          a.wardCode === order.wardCode &&
          a.street === order.street
      );
      setSelectedSavedId(matched ? matched.id : null);

      // Nếu không có sổ địa chỉ thì mở sẵn form, ngược lại chỉ hiện danh sách địa chỉ
      if (savedAddresses.length === 0) {
        setShowCustomForm(true);
      } else {
        setShowCustomForm(false);
      }
    }
  }, [order, isOpen, reset, savedAddresses]);

  // Tính tổng trọng lượng sản phẩm
  const totalWeight = useMemo(
    () =>
      orderItems.reduce(
        (sum, i) => sum + (i.productInfo?.weight || 200) * i.quantity,
        0
      ),
    [orderItems]
  );

  // Gọi API GHN tính phí ship cho địa chỉ mới
  const shippingFeeRequest = useMemo(() => {
    if (!districtId || !wardCode) return null;
    return {
      toDistrictId: Number(districtId),
      toWardCode: String(wardCode).trim(),
      weight: Math.max(200, totalWeight),
    };
  }, [districtId, wardCode, totalWeight]);

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

  // Hàm bấm Thêm mới địa chỉ: Xóa sạch form và bật hiển thị form nhập
  const handleAddNewAddress = () => {
    setSelectedSavedId(null);
    reset({
      fullName: "",
      phone: "",
      street: "",
      provinceId: undefined,
      districtId: undefined,
      wardCode: undefined,
    });
    setShowCustomForm(true);
  };

  if (!order) return null;

  const onSubmit = async (data: ChangeAddressFormData) => {
    if (isAddressIdentical) {
      toast.warning("Địa chỉ mới chọn trùng khớp hoàn toàn với địa chỉ ban đầu của đơn hàng!");
      return;
    }

    try {
      console.log("Cập nhật địa chỉ đơn hàng:", data);
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`Đã cập nhật địa chỉ nhận hàng cho đơn hàng #${order.orderCode}`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật địa chỉ thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      title="Thay đổi địa chỉ giao hàng"
      confirmText={isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
      cancelText="Hủy"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-12">
        {/* Banner thông tin đơn hàng */}
        <div className="flex items-center gap-3 p-3.5 bg-linear-to-r from-blue-50 to-indigo-50/70 rounded-2xl border border-blue-200/60 text-blue-900 shadow-2xs">
          <MapPin size={22} className="text-blue-600 shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-blue-950 text-base">
              Cập nhật địa chỉ nhận hàng cho đơn #{order.orderCode}
            </p>
            <p className="text-blue-700/90 text-xs mt-0.5">
              Lưu ý: Bạn có thể chọn từ sổ địa chỉ đã lưu bên dưới để cập nhật địa chỉ giao hàng.
            </p>
          </div>
        </div>

        {/* BỐ CỤC ĐỘNG (LAYOUT 12 KHI CHỈ CHỌN ĐỊA CHỈ LƯU, VÀ 6-6 KHI BẤM NHẬP ĐỊA CHỈ MỚI) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* CỘT 1: SỔ ĐỊA CHỈ & FORM ĐỊA CHỈ MỚI */}
          <div
            className={
              showCustomForm ? "md:col-span-6 space-y-3.5" : "md:col-span-12 space-y-3.5"
            }
          >
            {/* 1. SỔ ĐỊA CHỈ ĐÃ LƯU */}
            {savedAddresses.length > 0 && (
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-base font-bold text-slate-800">
                  <span className="flex items-center gap-2">
                    <BookUser size={18} className="text-blue-600" />
                    Sổ địa chỉ đã lưu
                  </span>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    showCustomForm ? "sm:grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
                  } gap-3 max-h-52 overflow-y-auto pr-1`}
                >
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
                              <span className="font-bold text-sm text-slate-900 line-clamp-1">
                                {addr.fullName}
                              </span>
                              <span className="text-xs text-slate-600 font-medium">
                                ({addr.phone})
                              </span>
                              {addr.default && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                              {addr.streetFull || addr.street}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. FORM ĐỊA CHỈ CHI TIẾT (CHỈ HIỆN KHI BẤM NHẬP ĐỊA CHỈ MỚI HOẶC KHÔNG CÓ ĐỊA CHỈ LƯU) */}
            {showCustomForm && (
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70 space-y-3.5 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-1 border-b border-slate-200/60">
                  <h4 className="font-bold text-base text-slate-900">
                    Nhập thông tin địa chỉ mới
                  </h4>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowCustomForm(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
                    >
                      ✕ Ẩn form nhập
                    </button>
                  )}
                </div>

                {/* HỌ VÀ TÊN + SỐ ĐIỆN THOẠI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField
                    label="Họ và tên"
                    name="fullName"
                    register={register}
                    rules={{ required: "Họ và tên không được bỏ trống" }}
                    error={errors.fullName}
                  />

                  <InputField
                    label="Số điện thoại"
                    name="phone"
                    register={register}
                    rules={{
                      required: "Số điện thoại không được bỏ trống",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Số điện thoại không đúng định dạng",
                      },
                    }}
                    error={errors.phone}
                  />
                </div>

                {/* TỈNH/THÀNH + QUẬN/HUYỆN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PROVINCE */}
                  <Controller
                    name="provinceId"
                    control={control}
                    rules={{ required: "Vui lòng chọn Tỉnh/Thành" }}
                    render={({ field, fieldState }) => (
                      <div>
                        <SelectBox<number>
                          label="Tỉnh/Thành"
                          placeholder="Chọn Tỉnh/Thành"
                          options={provinces.map((p) => ({
                            label: p.ProvinceName ?? "",
                            value: p.ProvinceID,
                          }))}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            field.onBlur();
                            setValue("districtId", undefined as unknown as number);
                            setValue("wardCode", undefined as unknown as string);
                          }}
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  {/* DISTRICT */}
                  <Controller
                    name="districtId"
                    control={control}
                    rules={{ required: "Vui lòng chọn Quận/Huyện" }}
                    render={({ field, fieldState }) => (
                      <div>
                        <SelectBox<number>
                          label="Quận/Huyện"
                          placeholder="Chọn Quận/Huyện"
                          options={districts.map((d) => ({
                            label: d.DistrictName ?? "",
                            value: d.DistrictID,
                          }))}
                          value={field.value}
                          disabled={!provinceId}
                          onChange={(val) => {
                            field.onChange(val);
                            field.onBlur();
                            setValue("wardCode", undefined as unknown as string);
                          }}
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* WARD */}
                <Controller
                  name="wardCode"
                  control={control}
                  rules={{ required: "Vui lòng chọn Phường/Xã" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <SelectBox<string>
                        label="Phường/Xã"
                        placeholder="Chọn Phường/Xã"
                        options={wards.map((w) => ({
                          label: w.WardName ?? "",
                          value: w.WardCode,
                        }))}
                        value={field.value}
                        disabled={!districtId}
                        onChange={(val) => {
                          field.onChange(val);
                          field.onBlur();
                        }}
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* STREET */}
                <TextAreaField<ChangeAddressFormData>
                  label="Địa chỉ cụ thể"
                  name="street"
                  register={register}
                  rules={{ required: "Địa chỉ không được bỏ trống" }}
                  error={errors.street}
                  rows={3}
                  placeholder="Số nhà, tên đường..."
                />
              </div>
            )}
          </div>

          {/* CỘT 2: SẢN PHẨM, COMPARISON CARDS ĐỊA CHỈ CỦ VS ĐỊA CHỈ MỚI & TÓM TẮT ĐƠN HÀNG */}
          <div
            className={
              showCustomForm ? "md:col-span-6 space-y-4" : "md:col-span-12 space-y-4"
            }
          >
            {/* 1. DANH SÁCH SẢN PHẨM */}
            {orderItems.length > 0 && (
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-base font-bold text-slate-900 pb-1.5 border-b border-slate-200/60">
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-blue-600" />
                    Sản phẩm
                  </span>
                </div>

                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
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
                        className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs"
                      >
                        <img
                          src={product?.urlImage}
                          alt={product?.name}
                          className="w-12 h-14 object-cover rounded-md border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {product?.name}
                          </h5>
                          <div className="flex items-center justify-end gap-2 text-sm">
                            {hasDiscount && (
                              <span className="line-through text-slate-400 text-xs font-normal">
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

            {/* 2. CARD SO SÁNH: ĐỊA CHỈ CỦ VS ĐỊA CHỈ MỚI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* CARD ĐỊA CHỈ CỦ (BAN ĐẦU) */}
              <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/90 space-y-1.5 text-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <MapPin size={15} className="text-slate-500 shrink-0" />
                    Địa chỉ cũ
                  </h4>
                  <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                    Ban đầu
                  </span>
                </div>
                <div className="pt-1 space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    {order.fullName} <span className="font-medium text-slate-600 text-xs">({order.phone})</span>
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {order.streetFull || order.street}
                  </p>
                </div>
              </div>

              {/* CARD ĐỊA CHỈ MỚI (THAY ĐỔI DỰ KIẾN) */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-1.5 text-sm">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5">
                  <h4 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                    <MapPin size={15} className="text-blue-600 shrink-0" />
                    Địa chỉ mới
                  </h4>
                  <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md">
                    Mới chọn
                  </span>
                </div>
                <div className="pt-1 space-y-1">
                  {fullName || phone || fullAddressPreview ? (
                    <>
                      <p className="font-bold text-blue-950 text-sm">
                        {fullName || "Chưa nhập họ tên"}{" "}
                        {phone && <span className="font-medium text-blue-800 text-xs">({phone})</span>}
                      </p>
                      <p className="text-xs text-blue-900/90 leading-relaxed">
                        {fullAddressPreview || "Chưa chọn đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã..."}
                      </p>
                    </>
                  ) : (
                    <p className="text-blue-400 italic text-xs pt-1">
                      Vui lòng chọn hoặc nhập thông tin nhận hàng...
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* THẺ BÁO LỖI NẾU ĐỊA CHỈ MỚI GIỐNG Y TRANG ĐỊA CHỈ CỦ (NẰM TRÊN TÓM TẮT ĐƠN HÀNG) */}
            {isAddressIdentical && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-900 text-sm font-medium animate-in fade-in duration-200 shadow-2xs">
                <AlertTriangle size={19} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-950 text-sm">Địa chỉ không thay đổi</p>
                  <p className="text-xs text-amber-800/90 leading-relaxed">
                    Địa chỉ mới vừa chọn trùng khớp hoàn toàn với địa chỉ ban đầu của đơn hàng. Vui lòng chọn địa chỉ khác để thay đổi.
                  </p>
                </div>
              </div>
            )}

            {/* 3. TÓM TẮT ĐƠN HÀNG */}
            {orderItems.length > 0 && (
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70 space-y-2.5 text-sm">
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

                    <div className="border-l-2 border-slate-200/80 pl-3 ml-1 space-y-0.5 text-xs text-slate-600">
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
                    <span className="text-slate-400 line-through text-xs">
                      {oldShippingFee > 0 ? formatMoney(oldShippingFee) : "0đ"}
                    </span>
                    <ArrowRight size={12} className="text-slate-400" />
                    <span className="text-slate-900 font-bold text-sm">
                      {currentShippingFee > 0 ? formatMoney(currentShippingFee) : "Miễn phí"}
                    </span>
                  </div>
                </div>

                {/* Dòng phân cách nét đứt */}
                <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">
                    Tổng cộng
                  </span>
                  <span className="font-bold text-red-600 text-xl tabular-nums">
                    {formatMoney(grandTotal)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
