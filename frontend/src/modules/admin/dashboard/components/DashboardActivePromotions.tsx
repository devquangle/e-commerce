import React from 'react';
import { Tag, Clock } from 'lucide-react';

const DashboardActivePromotions: React.FC = () => {
  const promotions = [
    { id: 1, name: 'Siêu sale giữa năm', discount: 'Giảm 50%', expiry: 'Còn 3 ngày' },
    { id: 2, name: 'Tuần lễ Sách thiếu nhi', discount: 'Giảm 30%', expiry: 'Còn 5 ngày' },
    { id: 3, name: 'Freeship mọi miền', discount: 'Miễn phí vận chuyển', expiry: 'Còn 1 tuần' },
  ];

  return (
    <div className="card-custom flex-1 flex flex-col p-4">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-200">
        <Tag className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-semibold text-slate-800">Khuyến mãi đang diễn ra</h2>
      </div>
      <div className="flex flex-col gap-3">
        {promotions.map((promo) => (
          <div key={promo.id} className="flex flex-col gap-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-medium text-slate-700">{promo.name}</span>
              <span className="text-emerald-600 font-semibold text-sm">{promo.discount}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
              <Clock className="w-4 h-4" />
              <span>{promo.expiry}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardActivePromotions;
