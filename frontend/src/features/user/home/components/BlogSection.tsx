import { ArrowRight, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogs = [
  { id: 1, title: 'Top 5 Cuốn Sách Phát Triển Bản Thân Nên Đọc', excerpt: 'Những cuốn sách này sẽ giúp bạn thay đổi tư duy và cách nhìn nhận cuộc sống, từ đó mở ra nhiều cơ hội mới.', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=400&auto=format&fit=crop', author: 'Minh Tuấn', date: '15/06/2026' },
  { id: 2, title: 'Review Sách: Nhà Giả Kim - Hành Trình Tìm Kiếm Chính Mình', excerpt: 'Một cuốn tiểu thuyết ngắn nhưng chứa đựng vô vàn triết lý sâu sắc về ước mơ và sự lựa chọn của con người.', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop', author: 'Lan Anh', date: '12/06/2026' },
  { id: 3, title: 'Bí Quyết Đọc Sách Nhanh Và Nhớ Lâu Hơn', excerpt: 'Đọc nhiều sách là tốt, nhưng làm sao để đọng lại kiến thức? Bài viết chia sẻ 3 phương pháp ghi nhớ hiệu quả.', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop', author: 'Bảo Hoàng', date: '08/06/2026' },
];

export default function BlogSection() {
  return (
    <section className="mt-16 mb-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Góc Độc Giả & Tin Tức</h2>
          <p className="mt-2 text-slate-500">Những bài viết review sách và chia sẻ kinh nghiệm hữu ích</p>
        </div>
        <Link to="/blog" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          Xem tất cả bài viết <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <article key={blog.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <Link to={`/blog/${blog.id}`} className="block relative aspect-[16/10] overflow-hidden shrink-0">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </Link>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {blog.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2">{blog.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
