import { 
  Plus, 
  Search, 
  Edit2, 
  Eye, 
  Trash2, 
  SlidersHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Product() {
  const products = [
    { sku: "SP1001", name: "iPhone 15 Pro Max 256GB Titanium", price: "28.990.000đ", stock: 12, status: "Đang bán" },
    { sku: "SP1002", name: "MacBook Air M3 8GB 256GB SSD", price: "31.490.000đ", stock: 8, status: "Đang bán" },
    { sku: "SP1003", name: "Tai nghe chụp tai Bluetooth Sony WH-1000XM5", price: "7.990.000đ", stock: 0, status: "Hết hàng" },
    { sku: "SP1004", name: "Củ sạc nhanh Anker GaNPrime 65W", price: "890.000đ", stock: 35, status: "Đang bán" },
  ];

  const statusBadgeClass = (status: string) => {
    return status === "Đang bán" 
      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
      : "bg-rose-50 text-rose-700 border-rose-100";
  };

  return (
    <section className="space-y-6 p-2 sm:p-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi tồn kho, giá bán và trạng thái hiển thị sản phẩm.</p>
        </div>
        <Link to="/admin/add-product" className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:shadow-indigo-600/15 transition-all duration-200 cursor-pointer active:scale-95">
          <Plus size={16} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* FILTERS & PRODUCTS CONTAINER */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        {/* FILTERS */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã hoặc tên..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-600 bg-white cursor-pointer">
            <option>Tất cả thể loại</option>
            <option>Điện thoại</option>
            <option>Laptop</option>
            <option>Phụ kiện</option>
          </select>
          
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-600 bg-white cursor-pointer">
            <option>Tất cả trạng thái</option>
            <option>Đang bán</option>
            <option>Hết hàng</option>
          </select>
          
          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer">
            <SlidersHorizontal size={14} />
            Lọc sản phẩm
          </button>
        </div>

        {/* ===================== DESKTOP TABLE ===================== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 font-semibold w-24">SKU</th>
                <th className="pb-3 font-semibold">Tên sản phẩm</th>
                <th className="pb-3 font-semibold w-36">Giá</th>
                <th className="pb-3 font-semibold w-28">Tồn kho</th>
                <th className="pb-3 font-semibold w-32">Trạng thái</th>
                <th className="pb-3 font-semibold text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product.sku} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 font-semibold text-slate-500">{product.sku}</td>
                  <td className="py-4 text-slate-900 font-semibold pr-4 truncate max-w-xs sm:max-w-md lg:max-w-lg" title={product.name}>
                    {product.name}
                  </td>
                  <td className="py-4 text-indigo-600 font-bold">{product.price}</td>
                  <td className="py-4 text-slate-600 font-medium">
                    <span className={`inline-flex items-center gap-1 ${product.stock === 0 ? "text-rose-600 font-bold" : "text-slate-600"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-1 whitespace-nowrap">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition active:scale-90 cursor-pointer" title="Chi tiết">
                      <Eye size={14} />
                    </button>
                    <Link to={`/admin/edit-product/${product.sku}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition active:scale-90 cursor-pointer" title="Sửa">
                      <Edit2 size={14} />
                    </Link>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 transition active:scale-90 cursor-pointer" title="Xóa">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===================== MOBILE CARDS ===================== */}
        <div className="block md:hidden space-y-4">
          {products.map((product) => (
            <div key={product.sku} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500 text-xs">{product.sku}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${statusBadgeClass(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                {product.name}
              </div>

              <div className="grid grid-cols-2 gap-2 border-y border-slate-200/50 py-2.5 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Giá bán:</span>
                  <span className="text-indigo-600 font-bold text-sm">{product.price}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Tồn kho:</span>
                  <span className={`font-semibold text-sm ${product.stock === 0 ? "text-rose-600 font-bold" : "text-slate-700"}`}>
                    {product.stock}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                  <Eye size={12} /> Chi tiết
                </button>
                <Link to={`/admin/edit-product/${product.sku}`} className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                  <Edit2 size={12} /> Sửa
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
