import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import SelectBox from "@/components/common/SelectedBox";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import type { GenreRequest, GenreResponse } from "../types/genre.type";
import type { UseFormSetError } from "react-hook-form";

interface GenreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectItem: GenreResponse | null;
  onSubmit: (data: GenreRequest, setError: UseFormSetError<GenreRequest>) => Promise<void>;
  file: File | null;
  setFile: (file: File | null) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const initGenre: GenreRequest = {
  name: "",
  previewImageUrl: "",
  status: BaseStatus.ACTIVE,
};

export default function GenreFormModal({
  isOpen,
  onClose,
  selectItem,
  onSubmit,
  file,
  setFile,
  avatarUrl,
  setAvatarUrl,
}: GenreFormModalProps) {
  const { register, handleSubmit, reset, setError, setValue, control, formState: { errors } } = useForm<GenreRequest>({ defaultValues: initGenre });

  useEffect(() => {
    if (isOpen) {
      if (selectItem) {
        reset({
          name: selectItem.name,
          previewImageUrl: selectItem.urlImage || "",
          status: selectItem.status,
        });
        setAvatarUrl(selectItem.urlImage || "");
      } else {
        reset(initGenre);
        setAvatarUrl("");
        setFile(null);
      }
    } else {
      reset(initGenre);
      setAvatarUrl("");
      setFile(null);
    }
  }, [isOpen, selectItem, reset, setAvatarUrl, setFile]);

  const currentStatus = useWatch({ control, name: "status" });

  const statusOptions = (Object.values(BaseStatus) as BaseStatus[]).map((value) => ({
    label: getBaseStatusLabel(value),
    value,
  }));

  // Cập nhật lại previewImageUrl khi avatarUrl thay đổi nếu cần thiết
  useEffect(() => {
    if (avatarUrl) {
      setValue("previewImageUrl", avatarUrl);
    }
  }, [avatarUrl, setValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectItem ? "Cập nhật Thể loại" : "Thêm Thể loại"}
      onConfirm={handleSubmit((data) => onSubmit(data, setError))}
      confirmText={selectItem ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      size="lg"
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <InputField label="Tên Thể loại" name="name" type="text" placeholder="Nhập tên..." register={register} rules={{ required: "Tên là bắt buộc" }} error={errors?.name} />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
          <SelectBox<BaseStatus> options={statusOptions} value={currentStatus} onChange={(val) => setValue("status", val)} searchable={false} />
        </div>

        <SingleImageUpload
          file={file}
          setFile={setFile}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
        />
      </form>
    </Modal>
  );
}
