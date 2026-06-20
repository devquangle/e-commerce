import Container from "@/components/common/Container";
import ProductCard from "@/components/user/ProductCard";
import ProductDescription from "@/features/user/product/components/ProductDescription";
import ProductReviews from "@/features/user/product/components/ProductReviews";
import ProductImages from "@/features/user/product/components/ProductImages";
import ProductInfo from "@/features/user/product/components/ProductInfo";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Product } from "@/types/product.type";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Manipulation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { ProductCard as ProductCardType } from "@/types/product.card.type";

const mockProduct = {
  id: 1,
  title: "Sách Marketing Căn Bản - Philip Kotler (Tái bản 2024)",
  price: 185000,
  originalPrice: 250000,
  author: ["Philip Kotler"],
  coverUrl: "https://picsum.photos/800/1000?random=1",
  images: [
    "https://picsum.photos/800/1000?random=10",
    "https://picsum.photos/800/1000?random=20",
    "https://picsum.photos/800/1000?random=30",
    "https://picsum.photos/800/1000?random=40",
    "https://picsum.photos/800/1000?random=50",
    "https://picsum.photos/800/1000?random=60",
  ],
  publishedAt: "2024-01-01",
  soldCount: 1520,
  rating: 4.8,
  reviewCount: 320,
  description:
    "Marketing căn bản là cuốn sách gối đầu giường của mọi marketer. Trong phiên bản tái bản mới nhất, tác giả Philip Kotler đã cập nhật thêm những xu hướng digital marketing hiện đại, giúp người đọc nắm bắt được sự chuyển dịch của thị trường.",
};

const relatedProducts: ProductCardType[] = [
  {
    id: 101,
    slug: 'dac-nhan-tam',
    name: 'Đắc Nhân Tâm - Dale Carnegie',
    soldCount: 5230,
    rating: 4.9,
    reviewCount: 1205,
    price: 86000,
    bage: 'Flash Sale',
    urlImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    promosionValue: 50,
  },
  {
    id: 102,
    slug: 'nha-gia-kim',
    name: 'Nhà Giả Kim (Tái bản)',
    soldCount: 3100,
    rating: 4.8,
    reviewCount: 890,
    price: 79000,
    bage: '',
    urlImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    promosionValue: 40,
  },
  {
    id: 103,
    slug: 'tuoi-tre-dang-gia-bao-nhieu',
    name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    soldCount: 8500,
    rating: 4.7,
    reviewCount: 2100,
    price: 65000,
    bage: 'Flash Sale',
    urlImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    promosionValue: 35,
  },
  {
    id: 104,
    slug: 'cang-ky-luat-cang-tu-do',
    name: 'Càng Kỷ Luật Càng Tự Do',
    soldCount: 1520,
    rating: 4.9,
    reviewCount: 320,
    price: 95000,
    bage: '',
    urlImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400',
    promosionValue: 20,
  },
  {
    id: 105,
    slug: 'luoc-su-loai-nguoi',
    name: 'Sapiens - Lược Sử Loài Người',
    soldCount: 4200,
    rating: 4.9,
    reviewCount: 1560,
    price: 155000,
    bage: '',
    urlImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    promosionValue: 25,
  }
];
export default function ProductDetailPage() {
  // Mock data for the new components based on mockProduct
  const mockProductResponse = {
    name: mockProduct.title,
    price: mockProduct.price,
    originalPrice: mockProduct.originalPrice,
    description: mockProduct.description,
    productAuthors: [
      { id: 1, name: "Philip Kotler" },
      { id: 2, name: "Gary Armstrong" }
    ],
    productGenres: [
      { id: 1, name: "Kinh tế" },
      { id: 2, name: "Marketing" },
      { id: 3, name: "Giáo trình" }
    ],
    publisherName: "Nhà Xuất Bản Trẻ",
    seriesName: "Kinh điển về Kinh doanh",
    isbn: "978-604-1-12345-6",
    pages: 720,
    publishYear: "2024",
  };

  const mockOverview = {
    rating: mockProduct.rating,
    reviewCount: mockProduct.reviewCount,
    starDetail: [
      { star: 5, count: 250 },
      { star: 4, count: 50 },
      { star: 3, count: 10 },
      { star: 2, count: 5 },
      { star: 1, count: 5 },
    ]
  };

  const mockComments = [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      star: 5,
      comment: "Sách rất hay, giao hàng nhanh chóng. Bọc sách cẩn thận không bị móp méo. Rất đáng tiền!",
      createdAt: "2 ngày trước",
      images: []
    },
    {
      id: 2,
      fullName: "Trần Thị B",
      star: 5,
      comment: "Nội dung bổ ích, phù hợp cho người mới bắt đầu tìm hiểu. Đã mua ủng hộ lần 2.",
      createdAt: "1 tuần trước",
      images: []
    },
    {
      id: 3,
      fullName: "Lê Văn C",
      star: 4,
      comment: "Sách giao hơi chậm nhưng chất lượng sách tốt.",
      createdAt: "2 tuần trước",
      images: []
    }
  ];

  return (
    <Container className="max-w-7xl px-4 md:px-8">
      {/* ==================== MAIN PRODUCT SECTION ==================== */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-4 md:p-8 my-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <ProductImages product={mockProductResponse} mockImages={mockProduct.images} />
          <ProductInfo 
            product={mockProductResponse} 
            rating={mockProduct.rating} 
            reviewCount={mockProduct.reviewCount} 
            soldCount={mockProduct.soldCount} 
          />
        </div>
      </div>

      {/* ==================== PRODUCT DETAILS ==================== */}
      <ProductDescription product={mockProductResponse} />
      <ProductReviews overview={mockOverview} comments={mockComments} />

      {/* ==================== RELATED PRODUCTS (Swiper Manipulation) ==================== */}
     
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Sản phẩm tương tự
          </h2>
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
              nextEl: ".related-next",
              prevEl: ".related-prev",
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
            {relatedProducts.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Container>
  );
}
