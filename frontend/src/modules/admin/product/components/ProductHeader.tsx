import { Plus, BookOpen } from "lucide-react";
import Button from "@/components/common/Button";

interface ProductHeaderProps {
  onCreate: () => void;
}

export default function ProductHeader({
  onCreate,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <BookOpen size={22} />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Quản lý sản phẩm
          </h1>
        </div>

        <p className="text-sm text-slate-500">
          Quản lý danh sách sách, giá bán và tồn kho trong hệ thống.
        </p>
      </div>

      <Button
        type="button"
        color="primary"
        className="w-full sm:w-auto cursor-pointer"
        onClick={onCreate}
      >
        <Plus size={18} />
        Thêm sản phẩm
      </Button>
    </div>
  );
}