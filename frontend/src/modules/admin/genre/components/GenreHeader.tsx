import { Layers, Plus, FileUp } from "lucide-react";
import Button from "@/components/common/Button";

interface GenreHeaderProps {
  onCreate: () => void;
  onImport: (file: File) => void;
}

export default function GenreHeader({
  onCreate,
  onImport,
}: GenreHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Layers size={22} />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý thể loại
          </h1>
        </div>

        <p className="text-sm text-slate-500">
          Phân loại sách và quản lý các danh mục sản phẩm.
        </p>
      </div>

      <div className="flex gap-2">
        <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
          <FileUp size={16} />
          Import Excel

          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                onImport(file);
              }

              e.target.value = "";
            }}
          />
        </label>

        <Button
          icon={Plus}
          onClick={onCreate}
        >
          Thêm mới
        </Button>
      </div>
    </div>
  );
}