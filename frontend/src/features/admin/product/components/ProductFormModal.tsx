import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import TextAreaField from "@/components/common/TextAreaField";
import SelectBox from "@/components/common/SelectedBox";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import type { ProductRequest, ProductResponse } from "../types/product.type";
import type { UseFormSetError } from "react-hook-form";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectItem: ProductResponse | null;
  onSubmit: (data: ProductRequest, setError: UseFormSetError<ProductRequest>) => Promise<void>;
}

const initProduct: ProductRequest = {
  name: "",
  authorIds: [],
  publisherId: undefined,
  genreIds: [],
  weight: 0,
  publishYear: "",
  pages: 0,
  price: 0,
  originalPrice: 0,
  quantity: 0,
  status: "ACTIVE",
  seriesId: undefined,
  isbn: "",
  coverImages: [],
  description: "",
};

export default function ProductFormModal({
  isOpen,
  onClose,
  selectItem,
  onSubmit,
}: ProductFormModalProps) {
  const { register, handleSubmit, reset, setError, setValue, control, formState: { errors } } = useForm<ProductRequest>({ defaultValues: initProduct });

  useEffect(() => {
    if (isOpen) {
      if (selectItem) {
        reset({
          name: selectItem.name,
          authorIds: selectItem.productAuthors?.map(a => a.id) || [],
          publisherId: selectItem.publisherId || undefined,
          genreIds: selectItem.productGenres?.map(g => g.id) || [],
          weight: selectItem.weight || 0,
          publishYear: selectItem.publishYear || "",
          pages: selectItem.pages || 0,
          price: selectItem.price || 0,
          originalPrice: selectItem.originalPrice || 0,
          quantity: selectItem.quantity || 0,
          status: "ACTIVE", // Or derive from selectItem if available
          seriesId: selectItem.seriesId || undefined,
          isbn: selectItem.isbn || "",
          coverImages: [], // Handle images separately
          description: selectItem.description || "",
        });
      } else {
        reset(initProduct);
      }
    } else {
      reset(initProduct);
    }
  }, [isOpen, selectItem, reset]);

  const currentStatus = useWatch({ control, name: "status" });

  const statusOptions = [
    { label: "Hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectItem ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm"}
      onConfirm={handleSubmit((data) => onSubmit(data, setError))}
      confirmText={selectItem ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      size="4xl"
    >
      <form className="space-y-4 max-h-[60vh] overflow-y-auto pr-2" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Tên Sản phẩm" name="name" type="text" placeholder="Nhập tên..." register={register} rules={{ required: "Tên là bắt buộc" }} error={errors?.name} />
          <InputField label="ISBN" name="isbn" type="text" placeholder="Nhập ISBN..." register={register} error={errors?.isbn} />
          
          <InputField label="Giá bán" name="price" type="number" register={register} error={errors?.price} valueAsNumber />
          <InputField label="Giá gốc" name="originalPrice" type="number" register={register} error={errors?.originalPrice} valueAsNumber />
          
          <InputField label="Số lượng" name="quantity" type="number" register={register} error={errors?.quantity} valueAsNumber />
          <InputField label="Trọng lượng (gram)" name="weight" type="number" register={register} error={errors?.weight} valueAsNumber />
          
          <InputField label="Năm xuất bản" name="publishYear" type="text" register={register} error={errors?.publishYear} />
          <InputField label="Số trang" name="pages" type="number" register={register} error={errors?.pages} valueAsNumber />
          
          <InputField label="Publisher ID" name="publisherId" type="number" register={register} error={errors?.publisherId} valueAsNumber />
          <InputField label="Series ID" name="seriesId" type="number" register={register} error={errors?.seriesId} valueAsNumber />
        </div>
        
        <TextAreaField label="Mô tả" name="description" placeholder="Nhập mô tả..." rows={4} register={register} error={errors?.description} />
        
        <div className="space-y-1 w-1/2">
          <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
          <SelectBox<string> options={statusOptions} value={currentStatus} onChange={(val) => setValue("status", val)} searchable={false} />
        </div>
      </form>
    </Modal>
  );
}
