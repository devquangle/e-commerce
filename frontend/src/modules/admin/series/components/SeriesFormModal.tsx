import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import TextAreaField from "@/components/common/TextAreaField";
import SelectBox from "@/components/common/SelectedBox";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import type { SeriesRequest, SeriesResponse } from "../types/series.type";
import type { UseFormSetError } from "react-hook-form";

interface SeriesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectItem: SeriesResponse | null;
  onSubmit: (data: SeriesRequest, setError: UseFormSetError<SeriesRequest>) => Promise<void>;
}

const initSeries: SeriesRequest = {
  name: "",
  description: "",
  status: BaseStatus.ACTIVE,
};

export default function SeriesFormModal({
  isOpen,
  onClose,
  selectItem,
  onSubmit,
}: SeriesFormModalProps) {
  const { register, handleSubmit, reset, setError, setValue, control, formState: { errors } } = useForm<SeriesRequest>({ defaultValues: initSeries });

  useEffect(() => {
    if (isOpen) {
      if (selectItem) {
        reset({
          name: selectItem.name,
          description: selectItem.description || "",
          status: selectItem.status,
        });
      } else {
        reset(initSeries);
      }
    } else {
      reset(initSeries);
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
      title={selectItem ? "Cập nhật Series" : "Thêm Series"}
      onConfirm={handleSubmit((data) => onSubmit(data, setError))}
      confirmText={selectItem ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      size="lg"
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <InputField label="Tên Series" name="name" type="text" placeholder="Nhập tên..." register={register} rules={{ required: "Tên là bắt buộc" }} error={errors?.name} />
        <TextAreaField label="Mô tả" name="description" placeholder="Nhập mô tả..." rows={4} register={register} error={errors?.description} />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
          <SelectBox<BaseStatus> options={statusOptions} value={currentStatus} onChange={(val) => setValue("status", val as BaseStatus)} searchable={false} />
        </div>
      </form>
    </Modal>
  );
}
