import { useState, useEffect } from 'react';
import type { ProductCard as ProductCardType } from '@/types/product.card.type';
import ProductCard from '@/components/user/ProductCard';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

interface Props {
  products: ProductCardType[];
}

export default function FlashSaleSection({ products }: Props) {
  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-1 sm:p-1.5 shadow-lg">
      <div className="rounded-xl bg-white p-4 sm:p-5 h-full w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4 sm:gap-4">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500 fill-amber-500" size={28} />
              <h2 className="text-2xl sm:text-3xl font-bold italic text-slate-900 tracking-tight">
                FLASH SALE
              </h2>
            </div>
            
            {/* Countdown */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="font-bold text-rose-600 text-lg">:</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white shadow-sm">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="font-bold text-rose-600 text-lg">:</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white shadow-sm">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          <Link
            to="/flash-sale"
            className="group flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Xem tất cả
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative group/swiper">
          <Swiper
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 16 },
              768: { slidesPerView: 4, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
            }}
            navigation={{
              nextEl: '.flash-next',
              prevEl: '.flash-prev',
            }}
            className="pb-2"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Nav Buttons */}
          <div className="flash-prev absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover/swiper:opacity-100 disabled:opacity-0 hover:bg-slate-50 text-slate-700">
            <ChevronRight size={24} className="rotate-180" />
          </div>
          <div className="flash-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover/swiper:opacity-100 disabled:opacity-0 hover:bg-slate-50 text-slate-700">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
