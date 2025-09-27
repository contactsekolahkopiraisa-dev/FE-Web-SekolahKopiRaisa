"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Eye } from "lucide-react";

interface ActivityItem {
  id: number;
  image: string;
  title: string;
}

interface ActivityCarouselProps {
  activityItems: ActivityItem[];
  onView: (id: number) => void;
}

export default function ActivityCarousel({
  activityItems,
  onView,
}: ActivityCarouselProps) {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        480: { slidesPerView: 1.5, spaceBetween: 16 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 3, spaceBetween: 24 },
      }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop={true}
      navigation={false}
      pagination={false}
      modules={[Autoplay, Navigation, Pagination]}
      className="w-full pb-12"
    >
      {activityItems.map((activity) => (
        <SwiperSlide
          key={activity.id}
          onClick={() => onView(activity.id)}
          className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl aspect-[4/3] transition-all duration-300 ease-out cursor-pointer border border-gray-100"
        >
          <div className="relative w-full h-full">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-300 ease-out" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300 ease-out">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-sm font-medium line-clamp-2 md:line-clamp-3 leading-relaxed">
                  {activity.title}
                </p>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Eye size={18} className="text-primary"/>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
