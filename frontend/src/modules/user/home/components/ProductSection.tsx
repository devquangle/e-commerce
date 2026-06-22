import { useId } from 'react';
import type { ProductCard as ProductCardType } from '@/types/product.card.type';
import ProductCard from '@/components/user/ProductCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Manipulation } from 'swiper/modules';

interface Props {
  title: string;
  products: ProductCardType[];
  link?: string;
}

export default function ProductSection({ title, products, link }: Props) {
  const uniqueId = useId().replace(/:/g, "");

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>

        {/* Right side: Xem tất cả + nav buttons */}
        <div className="flex items-center gap-2">
          {link && (
            <Link
              to={link}
              className="group hidden sm:flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mr-1"
            >
              Xem tất cả
              <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <div className={`section-prev-${uniqueId} flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 cursor-pointer text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed`}>
            <ChevronRight size={18} className="rotate-180" />
          </div>
          <div className={`section-next-${uniqueId} flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 cursor-pointer text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed`}>
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden -mx-4 px-4 py-4">
        <Swiper
          modules={[Navigation, Manipulation]}
          navigation={{
            nextEl: `.section-next-${uniqueId}`,
            prevEl: `.section-prev-${uniqueId}`,
          }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 6, spaceBetween: 24 },
          }}
          className="section-products-swiper pb-2"
        >
          {products.slice(0, 15).map((product) => (
            <SwiperSlide key={product.id} className="h-auto!">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
