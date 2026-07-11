import { useNavigate, useParams } from "react-router-dom";
import VoucherForm from "@/modules/admin/voucher/components/VoucherForm";
import type { VoucherRequest } from "@/modules/admin/voucher/types/voucher.type";
import { initialVouchers } from "./VoucherPage";

export default function UpdateVoucher() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  // Mock finding initial data. Later replace with API call like useQuery hook
  const initialData = initialVouchers.find((v) => v.code === code) || null;

  const handleFormSubmit = (formData: VoucherRequest) => {
    // Logic cho việc submit edit voucher (Tạm thời mockup, sau này sẽ tích hợp API)
    console.log("Update Voucher:", formData);
    // Quay về trang danh sách
    navigate("/admin/vouchers");
  };

  const handleCancel = () => {
    navigate("/admin/vouchers");
  };

  if (!initialData) {
    return (
      <div className="p-4 text-center text-rose-500 font-semibold">
        Không tìm thấy Voucher hoặc đang tải...
      </div>
    );
  }

  return (
    <div className="flex-1">
      <VoucherForm
        initialData={initialData}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
