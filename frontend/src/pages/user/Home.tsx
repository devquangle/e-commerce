import ProductCard from '@/components/common/ProductCard'
import Container from '@/components/Container'
import type { Product } from '@/types/Product';



const products: Product[] = [
   {
    id: 1,
    title: 'Naruto Tập 1',
    price: 25000,
    originalPrice: 35000,
    author: ['Masashi Kishimoto'],
    coverUrl: 'https://picsum.photos/300/400?random=1',
    publishedAt: '2025-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
},
    {
      id: 2,
    title: 'Naruto Tập 1',
    price: 25000,
    originalPrice: 35000,
    author: ['Masashi Kishimoto'],
    coverUrl: 'https://picsum.photos/300/400?random=1',
    publishedAt: '2025-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
    }
];



function Home() {
  return (
    <div className="pb-12">
      {/* HERO */}
      <section className="bg-linear-to-r from-indigo-50 via-white to-amber-50">
        <Container className="px-4 md:px-8 py-10 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                BOOKSTORE ONLINE
              </p>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Khám phá kho sách khổng lồ,
                <span className="block text-indigo-600">nuôi dưỡng thói quen đọc mỗi ngày.</span>
              </h1>
              <p className="mb-6 text-sm sm:text-base text-slate-600 max-w-xl">
                Hơn 10.000+ đầu sách từ văn học, kinh tế, kỹ năng sống đến thiếu nhi. Giao hàng nhanh, nhiều chương
                trình khuyến mãi và quà tặng kèm hấp dẫn.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                  Mua ngay
                </button>
                <button className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Xem sách bán chạy
                </button>
                <span className="text-xs text-slate-500">Giao nhanh trong 2 giờ tại nội thành</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-indigo-100 via-white to-amber-100 blur-lg opacity-70" />
              <div className="relative grid grid-cols-3 gap-3 rounded-3xl bg-white p-4 shadow-lg">
                <div className="col-span-2 flex flex-col justify-between rounded-2xl bg-indigo-50 p-4">
                  <div>
                    <p className="text-xs font-medium text-indigo-600">Ưu đãi trong tháng</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Combo 3 cuốn sách kỹ năng sống
                    </p>
                    <p className="mt-2 text-xs text-slate-600">Tiết kiệm lên đến 30%</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Giá chỉ từ</p>
                      <p className="text-lg font-bold text-indigo-600">249.000₫</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-indigo-600 shadow-sm">
                      Số lượng có hạn
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex-1 rounded-2xl bg-amber-50 p-3 text-xs text-slate-700">
                    <p className="font-semibold text-amber-700">Miễn phí vận chuyển</p>
                    <p className="mt-1 text-[11px]">Cho đơn từ 300.000₫ toàn quốc.</p>
                  </div>
                  <div className="flex-1 rounded-2xl bg-slate-900 p-3 text-xs text-slate-100">
                    <p className="font-semibold">Thành viên BookClub</p>
                    <p className="mt-1 text-[11px] text-slate-300">Tích điểm đổi quà, giảm giá độc quyền.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section className="mt-10">
        <Container className="px-4 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Khám phá theo thể loại</h2>
            <a href="#" className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Xem tất cả
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Văn học</p>
              <p className="mt-1 text-xs text-slate-500">Tiểu thuyết, truyện ngắn, thơ, văn học nước ngoài...</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Kinh tế &amp; kinh doanh</p>
              <p className="mt-1 text-xs text-slate-500">Quản trị, marketing, tài chính, khởi nghiệp...</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Kỹ năng sống &amp; phát triển bản thân</p>
              <p className="mt-1 text-xs text-slate-500">Tư duy, thói quen, tâm lý học ứng dụng...</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Thiếu nhi</p>
              <p className="mt-1 text-xs text-slate-500">Truyện tranh, truyện cổ tích, sách thiếu nhi song ngữ...</p>
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURED BOOKS */}
      <section className="mt-10">
        <Container className="px-4 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Sách nổi bật</h2>
            <a href="#" className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Xem thêm
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}

         
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Home