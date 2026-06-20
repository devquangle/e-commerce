import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

const testimonials = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Độc giả thường xuyên', content: 'Giao hàng cực kỳ nhanh, sách bọc cẩn thận. Rất hài lòng với dịch vụ của BookStore.', avatar: 'https://i.pravatar.cc/150?img=11', rating: 5 },
  { id: 2, name: 'Trần Thị B', role: 'Giáo viên', content: 'Tôi thường mua sách giáo khoa và tài liệu tham khảo ở đây. Nguồn sách phong phú và chính hãng.', avatar: 'https://i.pravatar.cc/150?img=5', rating: 5 },
  { id: 3, name: 'Lê Hoàng C', role: 'Sinh viên', content: 'Thường xuyên có mã giảm giá tốt cho sinh viên. Website dễ sử dụng và tìm kiếm sách rất tiện.', avatar: 'https://i.pravatar.cc/150?img=12', rating: 4 },
  { id: 4, name: 'Phạm D', role: 'Nhà văn', content: 'Chất lượng sách rất tốt, giấy đẹp, không bị lỗi in ấn. Đội ngũ hỗ trợ nhiệt tình khi tôi cần tư vấn.', avatar: 'https://i.pravatar.cc/150?img=32', rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="mt-16 bg-slate-50 py-12 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 rounded-3xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        <p className="mt-2 text-slate-500">Hơn 10,000+ đánh giá 5 sao từ độc giả trên toàn quốc</p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id} className="h-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < item.rating ? 'fill-current' : 'text-slate-200'} />
                ))}
              </div>
              <p className="text-slate-700 italic flex-1 mb-6">"{item.content}"</p>
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                  <span className="text-xs text-slate-500">{item.role}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
