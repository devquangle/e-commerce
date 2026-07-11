import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import VoucherHeaderAdd from "@/modules/admin/voucher/components/VoucherHeaderAdd";
import VoucherForm from "@/modules/admin/voucher/components/VoucherForm";
import { initialFormValues } from "@/modules/admin/voucher/constants/voucher.constant";
import type { VoucherRequest } from "@/modules/admin/voucher/types/voucher.type";

import { useCreateVoucher } from "@/modules/admin/voucher/hooks/useVoucher";

export default function CreateVoucher() {
  const navigate = useNavigate();
  const { mutate: createVoucher } = useCreateVoucher();

  const form = useForm<VoucherRequest>({
    defaultValues: initialFormValues,
  });

  const handleFormSubmit = (formData: VoucherRequest) => {
    createVoucher(formData, {
      onSuccess: () => {
        navigate("/admin/vouchers");
      },
     
    });
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
      <VoucherHeaderAdd
        onBack={handleCancel}
        onSave={handleSave}
        onReset={handleReset}
      />
      <VoucherForm form={form} isEdit={false} />
    </div>
  );
}
