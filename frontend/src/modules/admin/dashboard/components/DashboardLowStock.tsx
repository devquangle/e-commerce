import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DashboardLowStock: React.FC = () => {
  const lowStockItems = [
    { id: 1, name: 'Đắc Nhân Tâm', category: 'Kỹ năng sống', stock: 5 },
    { id: 2, name: 'Nhà Giả Kim', category: 'Tiểu thuyết', stock: 2 },
    { id: 3, name: 'Tội Ác Và Hình Phạt', category: 'Văn học cổ điển', stock: 4 },
    { id: 4, name: 'Lược Sử Loài Người', category: 'Khoa học', stock: 1 },
  ];

  return (
    <div className="card-custom flex-1 flex flex-col p-4">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-200">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-slate-800">Sách sắp hết hàng</h2>
      </div>
      <div className="flex flex-col gap-3">
        {lowStockItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex flex-col">
              <span className="font-medium text-slate-700">{item.name}</span>
              <span className="text-sm text-slate-500">{item.category}</span>
            </div>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded-full">
              Còn {item.stock} cuốn
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLowStock;
