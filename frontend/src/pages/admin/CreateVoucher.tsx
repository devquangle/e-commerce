import { useNavigate } from "react-router-dom";
import VoucherForm from "@/modules/admin/voucher/components/VoucherForm";
import type { VoucherRequest } from "@/modules/admin/voucher/types/voucher.type";

export default function CreateVoucher() {
  const navigate = useNavigate();

  const handleFormSubmit = (formData: VoucherRequest) => {
    // Logic cho việc submit create voucher (Tạm thời mockup, sau này sẽ tích hợp API)
    console.log("Create Voucher:", formData);
    // Quay về trang danh sách
    navigate("/admin/vouchers");
  };

  const handleCancel = () => {
    navigate("/admin/vouchers");
  };

  return (
    <div className="flex-1">
      <VoucherForm
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
