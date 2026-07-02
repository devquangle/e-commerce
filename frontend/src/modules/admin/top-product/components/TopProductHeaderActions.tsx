import React from "react";

interface TopProductHeaderActionsProps {
  duration: string;
  onDurationChange: (val: string) => void;
  onExportReport?: () => void;
}

const TopProductHeaderActions: React.FC<TopProductHeaderActionsProps> = ({
  duration,
  onDurationChange,
  onExportReport,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between card-custom p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Top sách bán chạy</h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi đầu sách có hiệu suất cao nhất theo doanh thu và số lượng bán.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <select 
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-indigo-500 focus:ring-2 cursor-pointer"
        >
          <option value="30days">30 ngày gần nhất</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>
        <button 
          onClick={onExportReport}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
        >
          Xuất báo cáo
        </button>
      </div>
    </div>
  );
};

export default TopProductHeaderActions;
