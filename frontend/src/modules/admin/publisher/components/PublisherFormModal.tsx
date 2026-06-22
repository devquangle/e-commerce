import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import SelectBox from "@/components/common/SelectedBox";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import type { PublisherRequest, PublisherResponse } from "../types/publisher.type";
import type { UseFormSetError } from "react-hook-form";

interface PublisherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectItem: PublisherResponse | null;
  onSubmit: (data: PublisherRequest, setError: UseFormSetError<PublisherRequest>) => Promise<void>;
}

const initPublisher: PublisherRequest = {
  name: "",
  street: "",
  status: BaseStatus.ACTIVE,
};

export default function PublisherFormModal({
  isOpen,
  onClose,
  selectItem,
  onSubmit,
}: PublisherFormModalProps) {
  const { register, handleSubmit, reset, setError, setValue, control, formState: { errors } } = useForm<PublisherRequest>({ defaultValues: initPublisher });

  useEffect(() => {
    if (isOpen) {
      if (selectItem) {
        reset({
          name: selectItem.name,
          street: selectItem.street || "",
          status: selectItem.status,
        });
      } else {
        reset(initPublisher);
      }
    } else {
      reset(initPublisher);
    }
  }, [isOpen, selectItem, reset]);

  const currentStatus = useWatch({ control, name: "status" });

  const statusOptions = (Object.values(BaseStatus) as BaseStatus[]).map((value) => ({
    label: getBaseStatusLabel(value),
    value,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectItem ? "Cập nhật Nhà xuất bản" : "Thêm Nhà xuất bản"}
      onConfirm={handleSubmit((data) => onSubmit(data, setError))}
      confirmText={selectItem ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      size="lg"
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <InputField label="Tên Nhà xuất bản" name="name" type="text" placeholder="Nhập tên..." register={register} rules={{ required: "Tên là bắt buộc" }} error={errors?.name} />
        <InputField label="Đường/Phố (Street)" name="street" type="text" placeholder="Nhập địa chỉ đường..." register={register} error={errors?.street} />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
          <SelectBox<BaseStatus> options={statusOptions} value={currentStatus} onChange={(val) => setValue("status", val)} searchable={false} />
        </div>
      </form>
    </Modal>
  );
}
