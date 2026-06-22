import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
}

interface Props {
  banners: Banner[];
}

export default function HeroBanner({ banners }: Props) {
  return (
    <div className="w-full relative rounded-2xl overflow-hidden shadow-sm group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        loop={true}
        className="h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex items-center">
                <div className="px-8 sm:px-12 md:px-16 max-w-2xl">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-200 mb-6 sm:mb-8 font-medium">
                    {banner.subtitle}
                  </p>
                  <Link
                    to={banner.link}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all shadow-[0_4px_16px_rgba(244,63,94,0.4)] hover:shadow-[0_6px_24px_rgba(244,63,94,0.6)] hover:-translate-y-0.5"
                  >
                    Khám phá ngay
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation */}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/30 backdrop-blur hover:bg-white/50 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m15 18-6-6 6-6"/></svg>
        </div>
        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/30 backdrop-blur hover:bg-white/50 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </Swiper>
    </div>
  );
}
