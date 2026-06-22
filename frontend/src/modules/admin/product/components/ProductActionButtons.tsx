import type { ProductResponse } from "@/types/product.type";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  item: ProductResponse;
  onDelete: (item: ProductResponse) => void;
  mobile?: boolean;
};

const ProductActionButtons = ({ item, onDelete, mobile = false }: Props) => {
  return (
    <div className={mobile ? "flex gap-2" : "inline-flex gap-2"}>
      <Link
        to={`/admin/edit-product/${item.id}`}
        className={
          mobile
            ? "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50"
            : "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        }
      >
        <Edit size={13} />
        Sửa
      </Link>

      <button
        onClick={() => onDelete(item)}
        className={
          mobile
            ? "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/50 py-2 text-xs font-semibold text-rose-600 transition-all hover:border-rose-200 hover:bg-rose-50"
            : "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-all hover:border-rose-300 hover:bg-rose-50"
        }
      >
        <Trash2 size={13} />
        Xóa
      </button>
    </div>
  );
};

export default ProductActionButtons;