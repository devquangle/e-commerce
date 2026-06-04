import { useState, useMemo, useEffect, useCallback } from "react";
import Modal from "@/components/common/Modal";
import { useForm, Controller } from "react-hook-form";
import InputField from "@/components/common/InputField";
import Pagination from "@/components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import { Plus, RotateCcw, Search, Users, Edit, Trash2, Eye } from "lucide-react";
import AuthorTable from "@/components/admin/author/AuthorTable";
import AuthorMobileCard from "@/components/admin/author/AuthorMobileCard";

// Mock Data
type AuthorStatus = "ACTIVE" | "INACTIVE";
type Author = { id: number; name: string; description: string; avatarUrl: string; bookCount: number; status: AuthorStatus };
const demoAuthors: Author[] = [
  { id: 1, name: "Nguyễn Nhật Ánh", description: "Nhà văn nổi tiếng với các tác phẩm thiếu nhi", avatarUrl: "https://placehold.co/100x100?text=NNA", bookCount: 45, status: "ACTIVE" },
  { id: 2, name: "Tô Hoài", description: "Tác giả của Dế Mèn Phiêu Lưu Ký", avatarUrl: "https://placehold.co/100x100?text=TH", bookCount: 32, status: "ACTIVE" },
  { id: 3, name: "Nam Cao", description: "Nhà văn hiện thực phê phán", avatarUrl: "https://placehold.co/100x100?text=NC", bookCount: 18, status: "ACTIVE" },
];

const initialFilterOptions = { keyword: "", page: 1, size: 10 };
const statusOptions = [
  { label: "Tất cả trạng thái", value: null },
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Ngừng hoạt động", value: "INACTIVE" },
];

export default function AuthorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? initialFilterOptions.keyword);
  const [status, setStatus] = useState<string | null>(searchParams.get("status") ?? null);
  const debouncedKeyword = useDebounce(keyword, 500);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectItem, setSelectItem] = useState<Author | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    defaultValues: { name: "", description: "", status: "ACTIVE" },
  });

  // Filter Logic (Mock)
  const filteredData = useMemo(() => {
    let result = demoAuthors;
    if (debouncedKeyword) result = result.filter(a => a.name.toLowerCase().includes(debouncedKeyword.toLowerCase()));
    if (status) result = result.filter(a => a.status === status);
    return result;
  }, [debouncedKeyword, status]);

  // Handlers
  const handleKeywordChange = (val: string) => setKeyword(val);
  const handleStatusChange = (val: any) => setStatus(val);
  const handleResetFilter = () => { setKeyword(""); setStatus(null); setSearchParams(new URLSearchParams()); };
  
  const handleOpenAdd = () => { reset(); setFile(null); setOpenAddModal(true); };
  const handleCloseAdd = () => { reset(); setFile(null); setOpenAddModal(false); };
  
  const handleOpenUpdate = (item: Author) => {
    setSelectItem(item);
    setValue("name", item.name);
    setValue("description", item.description);
    setValue("status", item.status);
    setOpenUpdateModal(true);
  };
  const handleCloseUpdate = () => { reset(); setOpenUpdateModal(false); };

  const handleOpenDelete = (item: Author) => { setSelectItem(item); setOpenDeleteModal(true); };
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
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Users size={22} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản lý tác giả
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Quản lý danh sách tác giả, thông tin và tiểu sử của họ.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Thêm tác giả
          </button>
        </div>

        {/* FILTER & TABLE */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên tác giả..."
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

          <AuthorTable authors={filteredData} onEdit={handleOpenUpdate} onDelete={handleOpenDelete} />
          <AuthorMobileCard authors={filteredData} onEdit={handleOpenUpdate} onDelete={handleOpenDelete} />
        </div>

        {/* PAGINATION */}
        <div className="mt-4">
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={filteredData.length} pageSize={10} onPageSizeChange={() => {}} />
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={openAddModal} onClose={handleCloseAdd} title="Thêm tác giả mới" onConfirm={handleSubmit(onSubmitAdd)} confirmText="Thêm tác giả" cancelText="Hủy" size="lg">
        <form className="space-y-4">
          <InputField label="Tên tác giả" name="name" type="text" placeholder="Nhập tên tác giả..." register={register} rules={{ required: "Tên tác giả là bắt buộc" }} error={errors?.name} />
          <InputField label="Mô tả / Tiểu sử" name="description" type="text" placeholder="Nhập mô tả..." register={register} error={errors?.description} />
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ảnh đại diện</label>
            {!file ? (
              <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 bg-slate-50/50 hover:border-indigo-500 hover:bg-indigo-50/10">
                <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
                  <span className="text-4xl">📁</span>
                  <span className="font-semibold text-slate-700">Chọn ảnh hoặc kéo thả vào đây</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
              </label>
            ) : (
              <div className="relative group rounded-2xl border border-slate-200 p-2 overflow-hidden bg-slate-50/30">
                <img src={URL.createObjectURL(file)} alt="preview" className="h-44 w-full rounded-xl object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-3">
                  <button type="button" onClick={() => setFile(null)} className="bg-rose-500 text-white p-2.5 rounded-xl hover:bg-rose-600 transition shadow-lg opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal isOpen={openUpdateModal} onClose={handleCloseUpdate} title="Cập nhật tác giả" onConfirm={handleSubmit(onSubmitUpdate)} confirmText="Lưu thay đổi" cancelText="Hủy" size="lg">
        <form className="space-y-4">
          <InputField label="Tên tác giả" name="name" type="text" placeholder="Nhập tên tác giả" register={register} rules={{ required: "Tên tác giả là bắt buộc" }} error={errors?.name} />
          <InputField label="Mô tả / Tiểu sử" name="description" type="text" placeholder="Nhập mô tả..." register={register} error={errors?.description} />
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
      <Modal isOpen={openDeleteModal} onClose={handleCloseDelete} title="Xóa tác giả" onConfirm={onSubmitDelete} confirmText="Xóa tác giả" cancelText="Hủy">
        <div className="py-2">
          {selectItem && (
            <p className="text-slate-700 text-base leading-relaxed">
              Bạn có chắc chắn muốn xóa tác giả <span className="font-bold text-slate-900">"{selectItem.name}"</span>?
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
