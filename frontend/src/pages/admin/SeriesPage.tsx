import { useState, useMemo } from "react";
import Modal from "@/components/common/Modal";
import { useForm, Controller } from "react-hook-form";
import InputField from "@/components/common/InputField";
import Pagination from "@/components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import { Plus, RotateCcw, Search, Library } from "lucide-react";
import SeriesTable from "@/components/admin/series/SeriesTable";
import SeriesMobileCard from "@/components/admin/series/SeriesMobileCard";

// Mock Data
type SeriesStatus = "ACTIVE" | "INACTIVE";
type Series = { id: number; name: string; description: string; bookCount: number; status: SeriesStatus };
const demoSeries: Series[] = [
  { id: 1, name: "Harry Potter", description: "Bộ truyện phù thủy nổi tiếng của J.K. Rowling", bookCount: 7, status: "ACTIVE" },
  { id: 2, name: "Sherlock Holmes", description: "Tuyển tập truyện trinh thám kinh điển", bookCount: 9, status: "ACTIVE" },
  { id: 3, name: "Kính Vạn Hoa", description: "Series truyện thiếu nhi của Nguyễn Nhật Ánh", bookCount: 45, status: "INACTIVE" },
];

const initialFilterOptions = { keyword: "", page: 1, size: 10 };
const statusOptions = [
  { label: "Tất cả trạng thái", value: null },
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Ngừng hoạt động", value: "INACTIVE" },
];

export default function SeriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? initialFilterOptions.keyword);
  const [status, setStatus] = useState<string | null>(searchParams.get("status") ?? null);
  const debouncedKeyword = useDebounce(keyword, 500);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectItem, setSelectItem] = useState<Series | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    defaultValues: { name: "", description: "", status: "ACTIVE" },
  });

  // Filter Logic (Mock)
  const filteredData = useMemo(() => {
    let result = demoSeries;
    if (debouncedKeyword) result = result.filter(a => a.name.toLowerCase().includes(debouncedKeyword.toLowerCase()));
    if (status) result = result.filter(a => a.status === status);
    return result;
  }, [debouncedKeyword, status]);

  // Handlers
  const handleKeywordChange = (val: string) => setKeyword(val);
  const handleStatusChange = (val: any) => setStatus(val);
  const handleResetFilter = () => { setKeyword(""); setStatus(null); setSearchParams(new URLSearchParams()); };
  
  const handleOpenAdd = () => { reset(); setOpenAddModal(true); };
  const handleCloseAdd = () => { reset(); setOpenAddModal(false); };
  
  const handleOpenUpdate = (item: Series) => {
    setSelectItem(item);
    setValue("name", item.name);
    setValue("description", item.description);
    setValue("status", item.status);
    setOpenUpdateModal(true);
  };
  const handleCloseUpdate = () => { reset(); setOpenUpdateModal(false); };

  const handleOpenDelete = (item: Series) => { setSelectItem(item); setOpenDeleteModal(true); };
  const handleCloseDelete = () => { setOpenDeleteModal(false); };

  const onSubmitAdd = (data: any) => { alert("Thêm: " + JSON.stringify(data)); handleCloseAdd(); };
  const onSubmitUpdate = (data: any) => { alert("Sửa: " + JSON.stringify(data)); handleCloseUpdate(); };
  const onSubmitDelete = () => { alert("Xoá: " + selectItem?.name); handleCloseDelete(); };

  return (
    <>
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                <Library size={22} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản lý Series sách
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Quản lý các bộ sách, bộ truyện hoặc series xuất bản.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Thêm Series
          </button>
        </div>

        {/* FILTER & TABLE */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên series..."
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div className="w-full md:w-56">
              <SelectBox options={statusOptions} value={status} onChange={handleStatusChange} searchable={false} />
            </div>
            <button
              onClick={handleResetFilter}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw size={16} /> Làm mới
            </button>
          </div>

          <SeriesTable seriesList={filteredData} onEdit={handleOpenUpdate} onDelete={handleOpenDelete} />
          <SeriesMobileCard seriesList={filteredData} onEdit={handleOpenUpdate} onDelete={handleOpenDelete} />
        </div>

        {/* PAGINATION */}
        <div className="mt-4">
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={filteredData.length} pageSize={10} onPageSizeChange={() => {}} />
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={openAddModal} onClose={handleCloseAdd} title="Thêm Series mới" onConfirm={handleSubmit(onSubmitAdd)} confirmText="Thêm Series" cancelText="Hủy" size="lg">
        <form className="space-y-4">
          <InputField label="Tên Series" name="name" type="text" placeholder="Nhập tên..." register={register} rules={{ required: "Tên là bắt buộc" }} error={errors?.name} />
          <InputField label="Mô tả" name="description" type="text" placeholder="Nhập mô tả..." register={register} error={errors?.description} />
        </form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal isOpen={openUpdateModal} onClose={handleCloseUpdate} title="Cập nhật Series" onConfirm={handleSubmit(onSubmitUpdate)} confirmText="Lưu thay đổi" cancelText="Hủy" size="lg">
        <form className="space-y-4">
          <InputField label="Tên Series" name="name" type="text" placeholder="Nhập tên..." register={register} rules={{ required: "Tên là bắt buộc" }} error={errors?.name} />
          <InputField label="Mô tả" name="description" type="text" placeholder="Nhập mô tả..." register={register} error={errors?.description} />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectBox options={statusOptions.filter(o => o.value !== null)} value={field.value} onChange={field.onChange} searchable={false} label="Trạng thái" />
            )}
          />
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={openDeleteModal} onClose={handleCloseDelete} title="Xóa Series" onConfirm={onSubmitDelete} confirmText="Xóa Series" cancelText="Hủy">
        <div className="py-2">
          {selectItem && (
            <p className="text-slate-700 text-base leading-relaxed">
              Bạn có chắc chắn muốn xóa Series <span className="font-bold text-slate-900">"{selectItem.name}"</span>?
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
