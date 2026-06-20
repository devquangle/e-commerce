import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductResponse } from "../types/product.detail.type";

interface ProductImagesProps {
  product: Partial<ProductResponse>;
  // For compatibility with current mock data, we might receive an array of strings
  mockImages?: string[];
}

export default function ProductImages({ product, mockImages }: ProductImagesProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Use coverImages from product if available, else use mockImages
  const images = product.coverImages?.length 
    ? product.coverImages.map(img => img.url) 
    : mockImages || [];

  const productName = product.name || "Product Image";

  if (!images.length) return null;

  return (
    <div className="lg:col-span-6 xl:col-span-4">
      {/* Main Swiper */}
      <div className="rounded-2xl overflow-hidden bg-slate-50 mb-3">
        <Swiper
          modules={[Thumbs, FreeMode, Navigation]}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          loop={true}
          navigation={{
            nextEl: ".product-main-next",
            prevEl: ".product-main-prev",
          }}
          className="aspect-[4/5] relative group"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img}
                alt={`${productName} - Ảnh ${idx + 1}`}
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
      <div className="hidden md:block">
        <Swiper
          modules={[Thumbs, FreeMode]}
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          spaceBetween={12}
          freeMode={true}
          watchSlidesProgress={true}
          className="product-thumbs"
        >
          {images.map((img, idx) => (
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
    </div>
  );
}
