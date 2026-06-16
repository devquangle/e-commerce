import { useState } from 'react';
import Container from '@/components/common/Container';
import ProductCard from '@/components/user/ProductCard';
import { Star, Minus, Plus, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product.type';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation, Manipulation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const mockProduct = {
  id: 1,
  title: 'Sách Marketing Căn Bản - Philip Kotler (Tái bản 2024)',
  price: 185000,
  originalPrice: 250000,
  author: ['Philip Kotler'],
  coverUrl: 'https://picsum.photos/800/1000?random=1',
  images: [
    'https://picsum.photos/800/1000?random=10',
    'https://picsum.photos/800/1000?random=20',
    'https://picsum.photos/800/1000?random=30',
    'https://picsum.photos/800/1000?random=40',
    'https://picsum.photos/800/1000?random=50',
    'https://picsum.photos/800/1000?random=60',
  ],
  publishedAt: '2024-01-01',
  soldCount: 1520,
  rating: 4.8,
  reviewCount: 320,
  description: 'Marketing căn bản là cuốn sách gối đầu giường của mọi marketer. Trong phiên bản tái bản mới nhất, tác giả Philip Kotler đã cập nhật thêm những xu hướng digital marketing hiện đại, giúp người đọc nắm bắt được sự chuyển dịch của thị trường.',
};

const relatedProducts: Product[] = [
  {
    id: 2,
    title: 'Đắc Nhân Tâm - Bí Quyết Thành Công',
    price: 95000,
    originalPrice: 120000,
    author: ['Dale Carnegie'],
    coverUrl: 'https://picsum.photos/400/500?random=2',
    publishedAt: '2023-05-15',
    soldCount: 8400,
    rating: 5.0,
    reviewCount: 1250,
    isFeatured: true
  },
  {
    id: 3,
    title: 'Sapiens - Lược Sử Loài Người',
    price: 210000,
    originalPrice: 265000,
    author: ['Yuval Noah Harari'],
    coverUrl: 'https://picsum.photos/400/500?random=3',
    publishedAt: '2022-10-10',
    soldCount: 3200,
    rating: 4.9,
    reviewCount: 890,
    isFeatured: false
  },
  {
    id: 4,
    title: 'Atomic Habits - Thay Đổi Tí Hon',
    price: 135000,
    originalPrice: 160000,
    author: ['James Clear'],
    coverUrl: 'https://picsum.photos/400/500?random=4',
    publishedAt: '2023-01-20',
    soldCount: 5600,
    rating: 4.8,
    reviewCount: 1100,
    isFeatured: true
  },
  {
    id: 5,
    title: 'Nhà Lãnh Đạo Không Chức Danh',
    price: 85000,
    originalPrice: 110000,
    author: ['Robin Sharma'],
    coverUrl: 'https://picsum.photos/400/500?random=5',
    publishedAt: '2021-08-05',
    soldCount: 2100,
    rating: 4.7,
    reviewCount: 450,
    isFeatured: false
  },
  {
    id: 6,
    title: 'Tâm Lý Học Tội Phạm',
    price: 155000,
    originalPrice: 195000,
    author: ['Diệp Hồng Vĩ'],
    coverUrl: 'https://picsum.photos/400/500?random=6',
    publishedAt: '2022-11-11',
    soldCount: 1250,
    rating: 4.6,
    reviewCount: 210,
    isFeatured: true
  },
  {
    id: 7,
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    price: 75000,
    originalPrice: 95000,
    author: ['Rosie Nguyễn'],
    coverUrl: 'https://picsum.photos/400/500?random=7',
    publishedAt: '2020-03-01',
    soldCount: 4500,
    rating: 4.5,
    reviewCount: 680,
    isFeatured: false
  },
  {
    id: 8,
    title: 'Cà Phê Cùng Tony',
    price: 68000,
    originalPrice: 85000,
    author: ['Tony Buổi Sáng'],
    coverUrl: 'https://picsum.photos/400/500?random=8',
    publishedAt: '2019-07-15',
    soldCount: 6200,
    rating: 4.7,
    reviewCount: 920,
    isFeatured: true
  }
];

export default function ProductDetail() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <Container className="max-w-7xl px-4 md:px-8">
        
        {/* BREADCRUMB */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Trang chủ</span>
          <span>/</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Sản phẩm</span>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate">{mockProduct.title}</span>
        </div>

        {/* ==================== MAIN PRODUCT SECTION ==================== */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-4 md:p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* ===== LEFT: SWIPER THUMBS GALLERY (4 columns) ===== */}
            <div className="lg:col-span-5 xl:col-span-4">
              {/* Main Swiper */}
              <div className="rounded-2xl overflow-hidden bg-slate-50 mb-3">
                <Swiper
                  modules={[Thumbs, FreeMode, Navigation]}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  loop={true}
                  navigation={{
                    nextEl: '.product-main-next',
                    prevEl: '.product-main-prev',
                  }}
                  className="aspect-[4/5] relative group"
                >
                  {mockProduct.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img 
                        src={img} 
                        alt={`${mockProduct.title} - Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}

                  {/* Custom navigation buttons */}
                  <button className="product-main-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="product-main-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={20} />
                  </button>
                </Swiper>
              </div>
              
              {/* Thumbs Swiper (grid 4 columns) */}
              <Swiper
                modules={[Thumbs, FreeMode]}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={12}
                freeMode={true}
                watchSlidesProgress={true}
                className="product-thumbs"
              >
                {mockProduct.images.map((img, idx) => (
                  <SwiperSlide key={idx} className="cursor-pointer">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-transparent transition-all hover:border-slate-300 [.swiper-slide-thumb-active_&]:border-blue-600 [.swiper-slide-thumb-active_&]:shadow-md [.swiper-slide-thumb-active_&]:scale-[1.03]">
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ===== RIGHT: PRODUCT INFO (8 columns) ===== */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  Chính hãng
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  Sách bán chạy
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-slate-900 leading-tight mb-4">
                {mockProduct.title}
              </h1>

              <div className="flex items-center flex-wrap gap-4 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 text-base ml-1">{mockProduct.rating}</span>
                  <span className="text-slate-500">({mockProduct.reviewCount} đánh giá)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <div>
                  Đã bán <span className="font-semibold text-slate-900">{mockProduct.soldCount}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <div>
                  Tác giả: <span className="font-semibold text-blue-600 cursor-pointer">{mockProduct.author.join(", ")}</span>
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-2xl p-6 mb-8 border border-slate-100">
                <div className="flex items-end gap-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-blue-600">
                    {mockProduct.price.toLocaleString()} ₫
                  </span>
                  {mockProduct.originalPrice > mockProduct.price && (
                    <>
                      <span className="text-lg text-slate-400 line-through mb-1 font-medium">
                        {mockProduct.originalPrice.toLocaleString()} ₫
                      </span>
                      <span className="mb-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">
                        -{Math.round((1 - mockProduct.price / mockProduct.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8 border-b border-slate-200 pb-8">
                {/* Quantity */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Số lượng</span>
                  <div className="flex items-center border border-slate-200 rounded-xl h-12 w-36 bg-white overflow-hidden shadow-sm">
                    <button onClick={handleDecrease} className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                      <Minus size={18} />
                    </button>
                    <input 
                      type="number" 
                      value={quantity}
                      readOnly
                      className="w-full h-full text-center font-semibold text-slate-900 border-x border-slate-200 focus:outline-none"
                    />
                    <button onClick={handleIncrease} className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex-1 flex gap-3 items-end">
                  <button className="h-12 px-6 bg-blue-50 text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none">
                    <ShoppingCart size={20} />
                    <span>Thêm vào giỏ</span>
                  </button>
                  <button className="h-12 px-8 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all flex-1">
                    Mua ngay
                  </button>
                  <button className="h-12 w-12 flex items-center justify-center border border-slate-200 rounded-xl text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                    <Heart size={22} />
                  </button>
                </div>
              </div>

              {/* PERKS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 text-green-700">
                  <ShieldCheck size={24} className="opacity-80" />
                  <span className="text-sm font-medium">100% Sách gốc, chất lượng cao</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 text-blue-700">
                  <Truck size={24} className="opacity-80" />
                  <span className="text-sm font-medium">Giao hàng siêu tốc trong 2h</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 text-amber-700">
                  <RotateCcw size={24} className="opacity-80" />
                  <span className="text-sm font-medium">Đổi trả miễn phí trong 30 ngày</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ==================== TABS SECTION ==================== */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 mb-12 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('description')}
              className={`flex-1 md:flex-none px-8 py-5 font-semibold text-lg transition-colors border-b-2 ${activeTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Mô tả sản phẩm
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 md:flex-none px-8 py-5 font-semibold text-lg transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Đánh giá ({mockProduct.reviewCount})
            </button>
          </div>

          <div className="p-6 md:p-10">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-slate-600 leading-relaxed text-base">
                <p>{mockProduct.description}</p>
                <p>Nội dung chi tiết sẽ được trình bày ở đây. Bạn có thể sử dụng HTML content tĩnh hoặc động từ API.</p>
                <ul className="list-disc pl-5 mt-4 space-y-2 font-medium text-slate-700">
                  <li>Khổ sách: 14x20.5 cm</li>
                  <li>Số trang: 350 trang</li>
                  <li>Nhà xuất bản: NXB Trẻ</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-center">
                    <div className="text-5xl font-black text-blue-600 mb-2">{mockProduct.rating}</div>
                    <div className="flex text-amber-400 mb-1 justify-center">
                      {[...Array(5)].map((_, i) => <Star key={i} className={i < Math.floor(mockProduct.rating) ? 'fill-current' : ''} size={20} />)}
                    </div>
                    <div className="text-sm text-slate-500">{mockProduct.reviewCount} đánh giá</div>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-12">{star} sao</span>
                        <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 80 : star === 4 ? 15 : 5}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button className="px-6 py-3 bg-white border border-blue-200 text-blue-600 font-bold rounded-xl shadow-sm hover:bg-blue-50 transition-colors">
                      Viết đánh giá
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="font-bold text-slate-900">Nguyễn Văn A</div>
                      <div className="text-sm text-slate-400">2 ngày trước</div>
                    </div>
                    <div className="flex text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className="fill-current" size={14} />)}
                    </div>
                    <p className="text-slate-600">Sách rất hay, giao hàng nhanh chóng. Bọc sách cẩn thận không bị móp méo. Rất đáng tiền!</p>
                  </div>
                  <div className="border-b border-slate-100 pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="font-bold text-slate-900">Trần Thị B</div>
                      <div className="text-sm text-slate-400">1 tuần trước</div>
                    </div>
                    <div className="flex text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className="fill-current" size={14} />)}
                    </div>
                    <p className="text-slate-600">Nội dung bổ ích, phù hợp cho người mới bắt đầu tìm hiểu. Đã mua ủng hộ lần 2.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== RELATED PRODUCTS (Swiper Manipulation) ==================== */}
        <Container></Container>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Sản phẩm tương tự</h2>
            <div className="flex items-center gap-2">
              <button className="related-prev w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft size={20} />
              </button>
              <button className="related-next w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden -mx-4 px-4 py-4">
            <Swiper
              modules={[Navigation, Manipulation]}
              navigation={{
                nextEl: '.related-next',
                prevEl: '.related-prev',
              }}
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="related-products-swiper"
            >
              {relatedProducts.map(product => (
                <SwiperSlide key={product.id} className="!h-auto">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

      </Container>
    </div>
  );
}
