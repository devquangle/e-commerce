import Container from "@/components/common/Container";
import { Clock, User } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Top 10 cuốn sách đáng đọc nhất năm 2024",
    excerpt: "Năm 2024 hứa hẹn mang đến nhiều tựa sách hấp dẫn từ các tác giả nổi tiếng. Cùng điểm qua danh sách những cuốn sách không thể bỏ lỡ.",
    image: "https://picsum.photos/600/400?random=11",
    author: "Admin",
    date: "15/05/2024"
  },
  {
    id: 2,
    title: "Cách đọc sách hiệu quả dành cho người bận rộn",
    excerpt: "Bạn quá bận rộn và không có thời gian đọc sách? Bài viết này sẽ hướng dẫn bạn các phương pháp duy trì thói quen đọc sách.",
    image: "https://picsum.photos/600/400?random=12",
    author: "BTV Văn Học",
    date: "10/05/2024"
  },
  {
    id: 3,
    title: "Review: Đắc Nhân Tâm - Bí quyết thành công",
    excerpt: "Cuốn sách Đắc Nhân Tâm của Dale Carnegie đã làm thay đổi cuộc đời của hàng triệu người. Liệu nó có thực sự thần thánh như lời đồn?",
    image: "https://picsum.photos/600/400?random=13",
    author: "Admin",
    date: "05/05/2024"
  }
];

export default function Blogs() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Container className="max-w-6xl px-4 md:px-8">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Tin tức & Bài viết</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 group cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-[3/2] overflow-hidden bg-slate-100">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <User size={16} />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{blog.date}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-slate-600 line-clamp-3 mb-4">
                  {blog.excerpt}
                </p>
                <span className="text-blue-600 font-semibold hover:underline">Đọc tiếp →</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
