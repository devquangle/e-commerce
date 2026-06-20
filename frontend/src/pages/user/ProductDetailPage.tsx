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

const relatedProducts: Product[] = [
  {
    id: 2,
    title: "Đắc Nhân Tâm - Bí Quyết Thành Công",
    price: 95000,
    originalPrice: 120000,
    author: ["Dale Carnegie"],
    coverUrl: "https://picsum.photos/400/500?random=2",
    publishedAt: "2023-05-15",
    soldCount: 8400,
    rating: 5.0,
    reviewCount: 1250,
    isFeatured: true,
  },
  {
    id: 3,
    title: "Sapiens - Lược Sử Loài Người",
    price: 210000,
    originalPrice: 265000,
    author: ["Yuval Noah Harari"],
    coverUrl: "https://picsum.photos/400/500?random=3",
    publishedAt: "2022-10-10",
    soldCount: 3200,
    rating: 4.9,
    reviewCount: 890,
    isFeatured: false,
  },
  {
    id: 4,
    title: "Atomic Habits - Thay Đổi Tí Hon",
    price: 135000,
    originalPrice: 160000,
    author: ["James Clear"],
    coverUrl: "https://picsum.photos/400/500?random=4",
    publishedAt: "2023-01-20",
    soldCount: 5600,
    rating: 4.8,
    reviewCount: 1100,
    isFeatured: true,
  },
  {
    id: 5,
    title: "Nhà Lãnh Đạo Không Chức Danh",
    price: 85000,
    originalPrice: 110000,
    author: ["Robin Sharma"],
    coverUrl: "https://picsum.photos/400/500?random=5",
    publishedAt: "2021-08-05",
    soldCount: 2100,
    rating: 4.7,
    reviewCount: 450,
    isFeatured: false,
  },
  {
    id: 6,
    title: "Tâm Lý Học Tội Phạm",
    price: 155000,
    originalPrice: 195000,
    author: ["Diệp Hồng Vĩ"],
    coverUrl: "https://picsum.photos/400/500?random=6",
    publishedAt: "2022-11-11",
    soldCount: 1250,
    rating: 4.6,
    reviewCount: 210,
    isFeatured: true,
  },
  {
    id: 7,
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    price: 75000,
    originalPrice: 95000,
    author: ["Rosie Nguyễn"],
    coverUrl: "https://picsum.photos/400/500?random=7",
    publishedAt: "2020-03-01",
    soldCount: 4500,
    rating: 4.5,
    reviewCount: 680,
    isFeatured: false,
  },
  {
    id: 8,
    title: "Cà Phê Cùng Tony",
    price: 68000,
    originalPrice: 85000,
    author: ["Tony Buổi Sáng"],
    coverUrl: "https://picsum.photos/400/500?random=8",
    publishedAt: "2019-07-15",
    soldCount: 6200,
    rating: 4.7,
    reviewCount: 920,
    isFeatured: true,
  },
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
