"use client";

import Image from "next/image";
import Footer from "../components/main/Footer";
import ImageAboutus from "../components/ImageAboutus";
import { useEffect, useState } from "react";
import { fetchAllActivity } from "./utils/activity";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActivityCarousel from "../components/activity/ActivityCarousel";
import { fetchAllProduct } from "./utils/product";
import { get } from "http";
import { addToCart, fetchAllCart } from "./utils/cart";
import Popup from "../components/Popup";
import ProductCarouselCard from "../components/product/ProductCarousel";
import ProductCarousel from "../components/product/ProductCarousel";
import { useCartStore } from "./stores/cartStore";
import { CartItemData } from "../components/card/CartCard";
import { ProductItem } from "./types/productType";
import { getUser } from "./utils/user";

interface ActivityItemApi {
  id: number;
  title: string;
  image: string;
}

export default function Home() {
  const [activities, setActivities] = useState<ActivityItemApi[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Add loading state

  const router = useRouter();

  const handleActivityClick = (id: number) => {
    router.push(`/activity/${id}`);
  };

  const checkUserAuthentication = async (): Promise<boolean> => {
    try {
      await getUser();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleBuyNow = async (id: number) => {
    // Check if user is logged in
    const isLoggedIn = await checkUserAuthentication();
    if (!isLoggedIn) {
      setMessage("Silakan login terlebih dahulu");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const selectedProduct = products.find((product) => product.id === id);
    if (!selectedProduct) return;

    const item: CartItemData = {
      id: selectedProduct.id ?? 0,
      products_id: selectedProduct.id ?? 0,
      imageUrl: selectedProduct.image ?? "",
      name: selectedProduct.name ?? "",
      partnerName: selectedProduct.partner?.name ?? "",
      price: Number(selectedProduct.price),
      quantity: 1,
      weight: selectedProduct.weight ?? 0,
      selected: true,
      fromCart: false,
    };

    useCartStore.getState().setCartItems([item]);
    router.push("/checkout");
  };

  const getActivities = async () => {
    try {
      const response = await fetchAllActivity();
      const rawData = response.data;

      // Sort by created_at date in descending order (newest first)
      const sortedData = [...rawData].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Map and filter, then take only the first 5 items
      const filtered: ActivityItemApi[] = sortedData
        .map((item: any) => {
          // Ambil media yang tipe-nya image
          const imageMedia = item.newsMedia?.find((media: any) =>
            media.media_type?.startsWith("image/")
          );

          if (!imageMedia) return null;

          return {
            id: item.id,
            title: item.title,
            image: imageMedia.media_url,
          };
        })
        .filter((item): item is ActivityItemApi => item !== null) // buang null
        .slice(0, 5); // batasi 5 data

      setActivities(filtered);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetchAllProduct();
      const rawData = response.data;
      const formattedData = rawData.map((item: ProductItem) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        partnerName: item.partner?.name,
      }));
      setProducts(formattedData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (isAddingToCart) return;

    // Check if user is logged in
    const isLoggedIn = await checkUserAuthentication();
    if (!isLoggedIn) {
      setMessage(
        "Silakan login terlebih dahulu"
      );
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await addToCart(productId, 1);
      setMessage(response.message);
      setPopupType("success");
      setShowPopup(true);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error: any) {
      setMessage(
        error.message || "Terjadi kesalahan saat menambahkan ke keranjang."
      );
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    getProducts();
    getActivities();
  }, []);

  return (
    <>
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      {/* Hero Section */}
      <section
        className="relative min-h-[500px] h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/background-homepage.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 h-full">
          <div className="flex flex-col md:flex-row items-center justify-center h-full gap-4 md:gap-8 lg:gap-16">
            <div className="mt-20 md:mt-100 text-center md:text-left">
              <h1 className="text-primary text-xl md:text-2xl">
                Membangun Ekosistem Kopi Berkualitas
              </h1>
              <h1 className="text-4xl md:text-6xl font-bold text-primary">
                Sekolah Kopi <br className="hidden sm:block" />
                Raisa
              </h1>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/assets/product1.png"
                alt="Logo"
                width={700}
                height={200}
                className="w-full max-w-[450px] lg:max-w-[800px] object-contain mt-4 md:mt-40 md:ml-20"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section className="bg-[#F5EDE4] py-10 md:py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Kolom Gambar */}
          <div className="w-full md:w-1/2">
            <ImageAboutus
              images={[
                {
                  src: "/assets/tk1.png",
                  alt: "Gambar 1",
                },
                {
                  src: "/assets/tk2.png",
                  alt: "Gambar 2",
                },
                {
                  src: "/assets/tk3.png",
                  alt: "Gambar 3",
                },
              ]}
            />
          </div>

          {/* Kolom Teks */}
          <div className="w-full mt-8 md:mt-0 md:ml-2">
            <h2 className="text-lg font-medium text-primary mb-4">
              Tentang Kami
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify text-sm">
              Perkembangan teknologi informasi pertanian mendorong perlunya
              edukasi cepat bagi petani agar tidak tertinggal. Oleh karena itu,
              dibentuklah kelembagaan lintas desa melalui BUMDESMA RAISA sebagai
              wadah kelompok tani yang lebih kuat dalam penyediaan sarana
              produksi, permodalan, perluasan usaha tani, dan pemasaran.
              BUMDESMA RAISA dibentuk oleh tiga desa di Kecamatan Sumberwringin
              (Sumberwringin, Rejoagung, dan Sukorejo) pada tahun 2021 dan
              mendirikan Sekolah Kopi RAISA Center sebagai unit usaha sosial.
              Nama RAISA merupakan singkatan dari Raung Ijen Sumberwringin
              Agropolitan.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed text-justify text-sm">
              Sekolah Kopi ini menjadi langkah strategis dalam pengelolaan kopi
              dari hulu ke hilir demi menjawab tantangan mutu dan keberlanjutan.
              Pembangunan Sekolah Kopi dimulai dengan peletakan batu pertama
              pada 24 Januari 2022 dan diresmikan pada 7 Agustus 2022 oleh
              Rektor Universitas Jember dan perwakilan PT Astra International.
              Sekolah ini merupakan hasil kolaborasi antara Universitas Jember,
              PT Astra International Tbk, petani kopi, dan Pemda Bondowoso.
              Sekolah Kopi RAISA juga menjadi simbol untuk menghidupkan kembali
              citra Bondowoso Republik Kopi (BRK). Gagasan sekolah ini berawal
              dari proposal DSA Bondowoso pada ajang sayembara KBA-DSA Super
              Prioritas 2021 oleh CSR PT Astra, yang akhirnya terpilih sebagai
              pemenang, mewujudkan impian adanya ikon perkopian di Bondowoso.
            </p>
            <Link href="/about">
              <button className="mt-6 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in">
                Lihat Selengkapnya
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Produk */}
      <section className="relative py-10 md:py-16 bg-white overflow-hidden">
        {/* Gambar Bunga Pojok Kanan Atas */}
        <div className="absolute -top-5 md:-top-5 right-0 w-32 md:w-48 lg:w-64">
          <img src="/assets/flower-top.png" alt="Bunga Hiasan" />
        </div>

        {/* Gambar Bunga Pojok Kiri Bawah */}
        <div className="absolute bottom-0 left-0 w-32 md:w-48 lg:w-64">
          <img src="/assets/flower-bottom.png" alt="Bunga Hiasan" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Judul Section */}
          <h2 className="text-lg font-medium text-center text-primary">
            Produk Kami
          </h2>
          <p className="text-center text-gray-600 mt-2 px-4 text-sm">
            Kopi dari para petani dan UMKM Bondowoso, hasil panen terbaik dari
            tanah yang subur
          </p>

          {/* Auto-Slide Produk */}
          <div className="mt-8 md:mt-10">
            <ProductCarousel
              productItems={products}
              onAddToCartClick={handleAddToCart}
              onBuyNowClick={handleBuyNow}
            />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-10 md:py-16 bg-[#F5EDE4]">
        <div className="container mx-auto px-4">
          {/* Judul Section */}
          <h2 className="text-lg font-medium text-center text-primary">
            Kegiatan Terbaru
          </h2>
          <p className="text-center text-gray-600 mt-2 text-sm">
            Cari tahu kegiatan dan info terbaru dari Sekolah Kopi Raisa
          </p>

          {/* Auto-Slide Aktivitas */}
          <div className="mt-8 md:mt-10">
            <ActivityCarousel
              activityItems={activities}
              onView={handleActivityClick}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
