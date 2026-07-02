import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { DashboardStat } from "../types/dashboard.type";

interface DashboardStatsCardsProps {
  stats: DashboardStat[];
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedStats = isExpanded ? stats : stats.slice(0, 4);
  const hasMore = stats.length > 4;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayedStats.map((item) => {
          const Icon = item.icon;
          return (
            <article 
              key={item.label} 
              className="relative overflow-hidden card-custom p-4 hover:scale-[1.02] flex flex-col justify-between"
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 inset-x-0 h-1 ${item.accentClass}`} />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">{item.label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconColor} transition-transform`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">{item.value}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp size={16} />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardStatsCards;
