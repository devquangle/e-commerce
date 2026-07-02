import React from 'react';
import { Bell, ShoppingCart, Tag, AlertTriangle, Info } from 'lucide-react';

const DashboardNotifications: React.FC = () => {
  const notifications = [
    { 
      id: 1, 
      type: 'order', 
      message: '5 đơn hàng mới cần xử lý ngay', 
      time: '10 phút trước' 
    },
    { 
      id: 2, 
      type: 'promo', 
      message: 'Khuyến mãi "Siêu sale" sắp hết hạn trong 3 ngày tới', 
      time: '1 giờ trước' 
    },
    { 
      id: 3, 
      type: 'stock', 
      message: 'Tồn kho thấp: "Đắc Nhân Tâm" chỉ còn 5 cuốn', 
      time: '2 giờ trước' 
    },
    { 
      id: 4, 
      type: 'info', 
      message: 'Cập nhật hệ thống thành công phiên bản v2.4.0', 
      time: '1 ngày trước' 
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-5 h-5 text-indigo-500" />;
      case 'promo': return <Tag className="w-5 h-5 text-emerald-500" />;
      case 'stock': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'info': return <Info className="w-5 h-5 text-violet-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-indigo-100';
      case 'promo': return 'bg-emerald-100';
      case 'stock': return 'bg-rose-100';
      case 'info': return 'bg-violet-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="card-custom flex-1 flex flex-col p-4">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-200">
        <Bell className="w-5 h-5 text-violet-600" />
        <h2 className="text-lg font-semibold text-slate-800">Thông báo</h2>
      </div>
      <div className="flex flex-col gap-3">
        {notifications.map((note) => (
          <div key={note.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
            <div className={`p-2 rounded-full flex-shrink-0 ${getBgColor(note.type)}`}>
              {getIcon(note.type)}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-700 leading-snug">{note.message}</p>
              <span className="text-xs text-slate-500">{note.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardNotifications;
