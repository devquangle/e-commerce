import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { VoucherRequest } from "@/modules/admin/voucher/types/voucher.type";
import VoucherForm from "@/modules/admin/voucher/components/VoucherForm";
import { initialFormValues } from "@/modules/admin/voucher/constants/voucher.constant";
import VoucherHeaderUpdate from "@/modules/admin/voucher/components/VoucherHeaderUpdate";

export default function UpdateVoucher() {
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm<VoucherRequest>({
    defaultValues: initialFormValues,
  });

  // Mock finding initial data. Later replace with API call like useQuery hook

  const handleFormSubmit = (formData: VoucherRequest) => {
    // Logic cho việc submit edit voucher (Tạm thời mockup, sau này sẽ tích hợp API)
    console.log("Update Voucher:", formData);
    // Quay về trang danh sách
  
  };

  const handleCancel = () => {
    navigate("/admin/vouchers");
  };
  const handleSave = () => {
    form.handleSubmit(handleFormSubmit)();
  };
  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* TODO: Add VoucherHeaderEdit here later */}
      <VoucherHeaderUpdate onBack={handleCancel} onSave={handleSave} />

      <VoucherForm form={form} isEdit={true} />
    </div>
  );
}
