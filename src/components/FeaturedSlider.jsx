import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedSlider = ({ productos }) => {
  return (
    <section className="py-12">
      {/* HEADER DEL SLIDER */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <h2 className="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter flex items-center gap-3">
          Camisetas más vendidas <span className="not-italic">🔥</span>
        </h2>

        {/* CONTROLES ESTILO MAXIKITS */}
        <div className="flex items-center gap-8">
          <button className="swiper-prev text-zinc-500 hover:text-white transition-colors text-2xl">←</button>
          <div className="swiper-num-pagination text-[10px] font-black tracking-widest text-zinc-400">
            {/* Aquí Swiper inyectará el 01 - 10 */}
          </div>
          <button className="swiper-next text-zinc-500 hover:text-white transition-colors text-2xl">→</button>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
        }}
        pagination={{
          el: '.swiper-num-pagination',
          type: 'fraction',
          renderFraction: (currentClass, totalClass) => {
            return `<span class="${currentClass}"></span> — <span class="${totalClass}"></span>`;
          },
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-10"
      >
        {productos.map((prod) => (
          <SwiperSlide key={prod.id}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-[#111] rounded-[2rem] overflow-hidden mb-4 border border-white/5">
                <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">{prod.nombre}</h3>
              <p className="text-xl font-black italic">${prod.precio.toLocaleString()}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedSlider;