import { Trash2 } from "lucide-react";

export function CartItemsToolbar({
  allChecked,
  someChecked,
  itemCount,
  onToggleAll,
  onDeleteSelected,
}: {
  allChecked: boolean;
  someChecked: boolean;
  itemCount: number;
  onToggleAll: () => void;
  onDeleteSelected: () => void;
}) {
  return (
    <div
      className="
        grid
        grid-cols-[40px_1fr_40px]
        lg:grid-cols-[40px_1fr_120px_140px_120px_40px]
        items-center
        border-b
        border-slate-100
        bg-slate-50/50
        rounded-t-xl
        py-2 lg:py-0
      "
    >
      {/* Cột 1: Checkbox */}
      <div className="flex justify-center items-center h-full">
        <input
          id="select-all-cart"
          type="checkbox"
          checked={allChecked}
          ref={(el) => {
            if (el) el.indeterminate = someChecked;
          }}
          onChange={onToggleAll}
          className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
        />
      </div>

      {/* Cột 2: Product Name info */}
      <label
        htmlFor="select-all-cart"
        className="cursor-pointer text-xs font-bold uppercase text-slate-500 select-none pl-2"
      >
        Chọn tất cả ({itemCount} sản phẩm)
      </label>

      {/* Cột 3: Price */}
      <div className="hidden lg:block text-right text-xs font-bold uppercase text-slate-500 pr-2">
        Đơn giá
      </div>

      {/* Cột 4: Quantity */}
      <div className="hidden lg:block text-center text-xs font-bold uppercase text-slate-500">
        Số lượng
      </div>

      {/* Cột 5: Total */}
      <div className="hidden lg:block text-right text-xs font-bold uppercase text-slate-500 pr-2">
        Thành tiền
      </div>

      {/* Cột 6: Delete button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onDeleteSelected}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
          title="Xóa mục đã chọn"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
