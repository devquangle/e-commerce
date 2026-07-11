import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import VoucherHeaderAdd from "@/modules/admin/voucher/components/VoucherHeaderAdd";
import VoucherForm from "@/modules/admin/voucher/components/VoucherForm";
import { initialFormValues } from "@/modules/admin/voucher/constants/voucher.constant";
import type { VoucherRequest } from "@/modules/admin/voucher/types/voucher.type";

export default function CreateVoucher() {
  const navigate = useNavigate();

  const form = useForm<VoucherRequest>({
    defaultValues: initialFormValues,
  });

  const handleFormSubmit = (formData: VoucherRequest) => {
    // Logic cho việc submit create voucher (Tạm thời mockup, sau này sẽ tích hợp API)
    console.log("Create Voucher:", formData);
    // Quay về trang danh sách
    navigate("/admin/vouchers");
  };

  const handleSave = () => {
    form.handleSubmit(handleFormSubmit)();
  };

  const handleReset = () => {
    form.reset(initialFormValues);
  };

  const handleCancel = () => {
    navigate("/admin/vouchers");
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <VoucherHeaderAdd onBack={handleCancel} onSave={handleSave} onReset={handleReset} />
      <div className="flex-1 flex flex-col">
        <VoucherForm form={form} isEdit={false} />
      </div>
    </div>
  );
}
