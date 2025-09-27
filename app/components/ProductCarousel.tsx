"use client";
import { ShoppingCart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ProductItem } from "../types/productType";

// export interface ProductCarouselItemProps {
//   // Mengganti nama interface agar lebih jelas
//   id: number;
//   name: string;
//   price: string;
//   image: string;
//   partnerName?: string; // Optional jika tidak selalu ada
// }

// Menambahkan interface untuk props komponen utama
export interface ProductCarouselCardProps {
  productItems: ProductItem[];
  onAddToCartClick: (productId: number) => void; // Prop fungsi untuk handle klik
  onBuyNowClick: (productId: number) => void; // Optional prop untuk handle beli sekarang
}

export default function ProductCarousel({
  productItems,
  onAddToCartClick, // Mengambil fungsi dari props
  onBuyNowClick,
}: ProductCarouselCardProps) {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        480: { slidesPerView: 1.5, spaceBetween: 16 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 24 },
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
      {productItems.map((product) => (
        <SwiperSlide key={product.id} className="h-auto">
          <div className="bg-secondary rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
            {/* Gambar Produk */}
            <img
              src={product.image}
              alt={product.name}
              className="h-70 object-cover"
            />

            {/* Informasi Produk */}
            <div className="p-3 flex flex-col flex-grow text-sm">
              <h3 className="text-gray-900 line-clamp-2 font-medium mb-1">
                {product.name}
              </h3>
              <p className="text-gray-700 font-medium mt-auto mb-3">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>
              {/* Tombol Beli */}
              <div className="flex gap-2 justify-between mt-auto">
                <button
                  className="w-full bg-primary text-white font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in"
                  onClick={() => onBuyNowClick(product.id ?? 0)}
                >
                  Beli Sekarang
                </button>
                <button
                  className="w-15 py-2 bg-primary text-white font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex items-center justify-center"
                  // Menambahkan event onClick di sini
                  onClick={() => onAddToCartClick(product.id ?? 0)}
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
