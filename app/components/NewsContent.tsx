import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface NewsContentProps {
  activity: {
    title: string;
    content: string;
    created_at: string;
    newsMedia?: { media_url: string; isThumbnail?: boolean }[];
  };
}

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Validate date
  if (isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
};

export default function NewsContent({ activity }: NewsContentProps) {
  if (!activity)
    return <div className="text-center py-10">Data tidak tersedia</div>;

  const thumbnailMedia = activity.newsMedia?.find((media) => media.isThumbnail);
  const otherMedia =
    activity.newsMedia?.filter((media) => !media.isThumbnail) || [];

  // Combine all media with thumbnail first if exists
  const allMedia = [...(thumbnailMedia ? [thumbnailMedia] : []), ...otherMedia];

  return (
    <div className="mb-10 max-w-4xl mx-auto">
      <h1 className="text-lg font-medium mb-3 text-gray-800">
        {activity.title}
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        {formatFullDate(activity.created_at)}
      </p>

      {allMedia.length > 0 && (
        <div className="relative mb-8 rounded-xl overflow-hidden">
          {allMedia.length > 1 ? (
            <>
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={{
                  nextEl: ".news-swiper-next",
                  prevEl: ".news-swiper-prev",
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop
                className="w-full aspect-video"
              >
                {allMedia.map((media, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <Image
                        src={media.media_url}
                        alt={`Galeri ${index + 1} - ${activity.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 80vw"
                        priority={index < 3}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                className="news-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary bg-opacity-80 hover:bg-opacity-100 transition p-2 rounded-full shadow-lg"
                aria-label="Slide sebelumnya"
              >
                <CircleArrowLeft className=" text-white" size={20} />
              </button>

              <button
                className="news-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary bg-opacity-80 hover:bg-opacity-100 transition p-2 rounded-full shadow-lg"
                aria-label="Slide berikutnya"
              >
                <CircleArrowRight className=" text-white" size={20} />
              </button>
            </>
          ) : (
            <div className="relative w-full aspect-video">
              <Image
                src={allMedia[0].media_url}
                alt={activity.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          )}
        </div>
      )}

      <article className="prose prose-sm sm:prose-base max-w-none text-justify text-gray-700">
        <div
          dangerouslySetInnerHTML={{ __html: activity.content }}
          className="[&_img]:mx-auto [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-4"
        />
      </article>
    </div>
  );
}
