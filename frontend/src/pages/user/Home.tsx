import Container from '@/components/common/Container';
import HeroBanner from '@/features/user/home/components/HeroBanner';
import HomeCategories from '@/features/user/home/components/HomeCategories';
import FlashSaleSection from '@/features/user/home/components/FlashSaleSection';
import ProductSection from '@/features/user/home/components/ProductSection';
import Testimonials from '@/features/user/home/components/Testimonials';
import BlogSection from '@/features/user/home/components/BlogSection';
import { 
  banners, 
  categories, 
  flashSaleProducts, 
  bestSellerProducts, 
  newProducts,
  highlyRatedProducts
} from '@/features/user/home/data/mockData';

export default function Home() {
  return (
    <div className="py-6 sm:py-8 bg-slate-50 min-h-screen">
      <Container className="max-w-7xl ">
        {/* 1. Hero Banner Carousel */}
        <HeroBanner banners={banners} />
        
        {/* 2. Danh mục nổi bật */}
        <HomeCategories categories={categories} />
        
        {/* 3. Flash Sale */}
        <FlashSaleSection products={flashSaleProducts} />
        
        {/* 4. Sách bán chạy */}
        <ProductSection 
          title="Bán Chạy Nhất" 
          products={bestSellerProducts} 
          link="/best-sellers" 
        />
        
        {/* 5. Sách mới phát hành */}
        <ProductSection 
          title="Mới Phát Hành" 
          products={newProducts} 
          link="/new-releases" 
        />
        
        {/* 6. Sản phẩm theo danh mục (Ví dụ: Kinh doanh) */}
        <ProductSection 
          title="Sách Kinh Doanh & Đầu Tư" 
          products={bestSellerProducts} 
          link="/category/kinh-doanh" 
        />
        
        {/* 7. Đánh giá cao */}
        <ProductSection 
          title="Sách Được Yêu Thích" 
          products={highlyRatedProducts} 
          link="/top-rated" 
        />

        {/* 8. Testimonials - Đánh giá khách hàng */}
        <Testimonials />

        {/* 9. Blog / Góc độc giả */}
        <BlogSection />
      </Container>
    </div>
  );
}