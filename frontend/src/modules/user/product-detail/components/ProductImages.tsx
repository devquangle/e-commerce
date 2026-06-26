import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductResponse } from "../types/product.detail.type";

interface ProductImagesProps {
  product: Partial<ProductResponse>;
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
    <div className="lg:col-span-6 xl:col-span-4 flex flex-col gap-3">
      {/* Main Swiper */}
      <div className="rounded-2xl overflow-hidden bg-slate-50 relative">
        <Swiper
          modules={[Thumbs, FreeMode, Navigation, Pagination]}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          loop={true}
          navigation={{
            nextEl: ".product-main-next",
            prevEl: ".product-main-prev",
          }}
          pagination={{ clickable: true }}
          className="aspect-[4/5] relative group pb-8" // padding bottom for pagination dots
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="bg-slate-50">
              <img
                src={img}
                alt={`${productName} - Ảnh ${idx + 1}`}
                className="w-full h-full object-contain p-4"
              />
            </SwiperSlide>
          ))}

          {/* Custom navigation buttons */}
          <button className="product-main-prev absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft size={20} />
          </button>
          <button className="product-main-next absolute right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight size={20} />
          </button>
        </Swiper>

        {/* Căn chỉnh lại dấu chấm của Swiper bằng CSS ẩn bên trong */}
        <style dangerouslySetInnerHTML={{__html: `
          .swiper-pagination-bullet { width: 8px; height: 8px; background: #cbd5e1; opacity: 1; transition: all 0.3s ease; }
          .swiper-pagination-bullet-active { background: #4f46e5; width: 24px; border-radius: 4px; }
          .swiper-pagination { bottom: 20px !important; }
        `}} />
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
          className="product-thumbs !py-1 !px-[2px]"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="cursor-pointer">
              <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 transition-all [.swiper-slide-thumb-active_&]:border-blue-600 [.swiper-slide-thumb-active_&]:ring-2 [.swiper-slide-thumb-active_&]:ring-blue-600 [.swiper-slide-thumb-active_&]:ring-offset-2 bg-white flex items-center justify-center p-1">
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
