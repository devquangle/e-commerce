import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "@/components/common/Container";
import ProductDescription from "@/modules/user/product-detail/components/ProductDescription";
import ProductReviews from "@/modules/user/product-detail/components/ProductReviews";
import ProductImages from "@/modules/user/product-detail/components/ProductImages";
import ProductInfo from "@/modules/user/product-detail/components/ProductInfo";
import ProductTable from "@/modules/user/product-detail/components/ProductTable";
import RelatedProducts from "@/modules/user/product-detail/components/RelatedProducts";

import type { ProductCard as ProductCardType } from "@/types/product.card.type";
import type { ProductResponse } from "@/modules/user/product-detail/types/product-detail.type";
import type { ProductReviewResponse } from "@/modules/user/product-detail/types/product-review.type";

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
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug");

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Mock data for the new components based on mockProduct
  const mockProductResponse: ProductResponse = {
    id: mockProduct.id,
    slug: slug || "marketing-can-ban",
    name: mockProduct.title,
    price: mockProduct.price,
    discountValue: 26,
    description: mockProduct.description,
    productAuthors: [
      { id: 1, name: "Philip Kotler", slug: "philip-kotler" },
      { id: 2, name: "Gary Armstrong", slug: "gary-armstrong" }
    ],
    productGenres: [
      { id: 1, name: "Kinh tế", slug: "kinh-te" },
      { id: 2, name: "Marketing", slug: "marketing" },
      { id: 3, name: "Giáo trình", slug: "giao-trinh" }
    ],
    productPublisher: { id: 1, name: "Nhà Xuất Bản Trẻ", slug: "nha-xuat-ban-tre" },
    productSeries: { id: 1, name: "Kinh điển về Kinh doanh", slug: "kinh-dien-ve-kinh-doanh" },
    isbn: "978-604-1-12345-6",
    pages: 720,
    publishYear: "2024",
    weight: 450,
    quantity: 100,
    language: "vi",
    coverImages: mockProduct.images.map((url, idx) => ({
      url,
      isThumbnail: idx === 0
    })),
    soldCount: 2560,
  };

  const mockOverview: ProductReviewResponse = {
    rating: mockProduct.rating,
    reviewCount: mockProduct.reviewCount,
    starDetail: [
      { start: 5, count: 250 },
      { start: 4, count: 50 },
      { start: 3, count: 10 },
      { start: 2, count: 5 },
      { start: 1, count: 5 },
    ],
    comments: [
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
    ]
  };


  return (
    <Container className="max-w-7xl p-2">
      {/* 2-Column layout for Main Product & Specifications & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-4 items-start">
        
        {/* LEFT COLUMN: Images, Policies */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 h-fit flex flex-col gap-4">
          <div className="card-custom-v1 p-2">
            <ProductImages product={mockProductResponse} />
          </div>
          
         
        </div>

        {/* RIGHT COLUMN: Info, Specs Table, Description */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="card-custom">
            <ProductInfo 
              product={mockProductResponse} 
              review={mockOverview}
            />
          </div>

          <ProductTable product={mockProductResponse} />
          <ProductDescription product={mockProductResponse} />
        </div>

      </div>

      {/* FULL WIDTH BOTTOM SECTIONS */}
      <ProductReviews data={mockOverview} />
      <RelatedProducts relatedProducts={relatedProducts} />
    </Container>
  );
}
