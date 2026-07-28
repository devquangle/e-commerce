import { SlidersHorizontal } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import SelectedMutil from "@/components/common/SelectedMutil";
import SelectBox from "@/components/common/SelectedBox";
import type { ProductRequest } from "@/modules/admin/product/types/product.type";

interface ProductAttributeProps {
  control: Control<ProductRequest>;
  genreOptions: { label: string; value: number }[];
  authorOptions: { label: string; value: number }[];
  publisherOptions: { label: string; value: number }[];
  seriesOptions: { label: string; value: number }[];
}

export default function ProductAttribute({
  control,
  genreOptions,
  authorOptions,
  publisherOptions,
  seriesOptions,
}: ProductAttributeProps) {
  return (
    <div className="col-span-12 xl:col-span-5 space-y-6 xl:h-full">
      <div className="card-custom space-y-4 xl:h-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <SlidersHorizontal size={18} className="text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Thuộc tính</h2>
        </div>

        <div className="space-y-5">
          <Controller
            name="genreIds"
            control={control}
            rules={{ required: "Vui lòng chọn thể loại" }}
            render={({ field, fieldState }) => (
              <div>
                <SelectedMutil<number>
                  label="Thể loại"
                  placeholder="Chọn thể loại..."
                  options={genreOptions}
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
                {fieldState.error && (
                  <p className="text-red-600 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="authorIds"
            control={control}
            rules={{ required: "Vui lòng chọn tác giả" }}
            render={({ field, fieldState }) => (
              <div>
                <SelectedMutil<number>
                  label="Tác giả"
                  placeholder="Chọn tác giả..."
                  options={authorOptions}
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
                {fieldState.error && (
                  <p className="text-red-600 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="publisherId"
            control={control}
            rules={{ required: "Vui lòng chọn nhà xuất bản" }}
            render={({ field, fieldState }) => (
              <div>
                <SelectBox<number>
                  label="Nhà xuất bản"
                  options={publisherOptions}
                  placeholder="Chọn nhà xuất bản..."
                  value={field.value}
                  onChange={field.onChange}
                  required
                  isClearable
                />
                {fieldState.error && (
                  <p className="text-red-600 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="seriesId"
            control={control}
            render={({ field }) => (
              <SelectBox<number>
                searchable
                label="Series"
                options={seriesOptions}
                value={field.value}
                placeholder="Chọn series..."
                onChange={field.onChange}
                isClearable
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
