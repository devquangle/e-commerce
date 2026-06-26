import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Manipulation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "@/components/user/ProductCard";
import type { ProductCard as ProductCardType } from "@/types/product.card.type";

interface RelatedProductsProps {
  relatedProducts: ProductCardType[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
  return (
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
            <SwiperSlide key={product.id} className="h-auto!">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
