import React from 'react';
import { LineChart } from 'lucide-react';

const DashboardRevenueChart: React.FC = () => {
  const data = [
    { label: 'T2', value: 40 },
    { label: 'T3', value: 70 },
    { label: 'T4', value: 45 },
    { label: 'T5', value: 90 },
    { label: 'T6', value: 65 },
    { label: 'T7', value: 85 },
    { label: 'CN', value: 55 },
  ];

  return (
    <div className="card-custom p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <LineChart className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Biểu đồ doanh thu</h2>
      </div>
      
      <div className="flex-1 min-h-[200px] flex items-end gap-2 sm:gap-4 justify-between pt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full relative h-40 bg-slate-100 rounded-t-sm flex items-end justify-center">
              <div 
                className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-colors"
                style={{ height: `${item.value}%` }}
              ></div>
            </div>
            <span className="text-xs sm:text-sm text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRevenueChart;
