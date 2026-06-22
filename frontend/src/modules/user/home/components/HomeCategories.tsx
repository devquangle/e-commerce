import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  bg: string;
}

interface Props {
  categories: Category[];
}

// Hàm lấy icon động từ lucide-react
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = ((LucideIcons as unknown) as Record<string, typeof LucideIcons.HelpCircle>)[name];
  if (!IconComponent) return <LucideIcons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

export default function HomeCategories({ categories }: Props) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Danh Mục Nổi Bật</h2>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="group flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${category.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md`}>
              <DynamicIcon name={category.icon} className={`w-7 h-7 sm:w-8 sm:h-8 ${category.color}`} />
            </div>
            <span className="text-[12px] sm:text-[13px] font-medium text-slate-700 text-center leading-tight group-hover:text-indigo-600 transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
