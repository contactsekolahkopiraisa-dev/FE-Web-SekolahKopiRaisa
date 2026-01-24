// app/produk/[id]/page.tsx (atau path yang sesuai)
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// Impor fungsi fetch API dan tipe ProductItem Anda
import { fetchProductById } from "@/app/utils/product"; // <--- SESUAIKAN PATH INI
import { formatCurrency } from "@/app/utils/helper";
import {
  Lightbulb,
  NotebookPen,
  Package,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { addToCart } from "@/app/utils/cart";
import Popup from "@/components/Popup";
import { CartItemData } from "@/components/card/CartCard";
import { useCartStore } from "@/app/stores/cartStore";
import Footer from "@/components/main/Footer";
import { ProductItem } from "@/app/types/productType";
import { getUser } from "@/app/utils/user";

export default function ProductDetailPage() {
  const params = useParams();
  const productIdString = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string | undefined);

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  const [isAddingToCart, setIsAddingToCart] = useState(false); // Add loading state

  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUser();
        setAuthorized(true);
      } catch {
        setAuthorized(false);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (productIdString) {
      const loadProductData = async (idStr: string) => {
        setLoading(true);
        setError(null);
        setProduct(null); // Kosongkan produk saat memulai fetch baru

        const idNum = parseInt(idStr, 10);
        if (isNaN(idNum)) {
          setError("Format ID produk tidak valid.");
          setLoading(false);
          return;
        }

        try {
          console.log(`Mengambil produk dengan ID: ${idNum}`);
          // Panggil fungsi fetchProductById yang sebenarnya
          // Asumsi: fetchProductById mengembalikan objek seperti { message: "...", data: ProductItem }
          // atau langsung ProductItem. Kita akan coba asumsikan yang pertama.
          const apiResponse = await fetchProductById(idNum);

          // Cek apakah apiResponse memiliki properti 'data' dan itu adalah objek produknya
          // atau jika apiResponse itu sendiri adalah objek produknya.
          if (apiResponse && typeof apiResponse === "object") {
            if ("data" in apiResponse && typeof apiResponse.data === "object") {
              // Kasus: API mengembalikan { message: "...", data: ProductItem }
              setProduct(apiResponse.data as ProductItem);
            } else {
              // Kasus: API langsung mengembalikan ProductItem
              setProduct(apiResponse as ProductItem);
            }
          } else {
            throw new Error("Format respons API tidak dikenali.");
          }
        } catch (err: any) {
          console.error("Error di ProductPage dari fetchProductById:", err);
          let errorMessage =
            "Terjadi kesalahan yang tidak diketahui saat mengambil produk.";
          if (err && err.message) {
            errorMessage = err.message;
            // Anda bisa menambahkan logika untuk err.type atau err.errors di sini jika perlu
            if (err.type === "validation") {
              console.error("Detail Validasi:", err.errors);
            }
          }
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      loadProductData(productIdString);
    } else if (!loading && params.id !== undefined) {
      // params.id ada tapi undefined/kosong setelah loading awal
      setError("ID produk tidak ditemukan di URL.");
      setLoading(false);
    }
  }, [productIdString]); // Efek bergantung pada productIdString

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  const handleDecrementQuantity = () =>
    setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrementQuantity = () =>
    setQuantity((prev) => Math.min(product?.inventory?.stock || 99, prev + 1));

  const handleAddToCart = async (productId: number) => {
    // Show maintenance popup
    setMessage(
      "Maaf, fitur keranjang belanja sedang dalam maintenance dan belum bisa digunakan.",
    );
    setPopupType("error");
    setShowPopup(true);
    return;

    // Original code (commented out during maintenance)
    // if (isAddingToCart) return; // Prevent multiple clicks

    // setIsAddingToCart(true);
    // try {
    //   const response = await addToCart(productId, quantity);
    //   setMessage(response.message);
    //   setPopupType("success");
    //   setShowPopup(true);
    //   window.dispatchEvent(new CustomEvent("cartUpdated"));
    // } catch (error: any) {
    //   setMessage(error.message || "Terjadi kesalahan saat menghapus.");
    //   setPopupType("error");
    //   setShowPopup(true);
    // } finally {
    //   setIsAddingToCart(false);
    // }
  };

  const handleBuyNow = () => {
    // Show maintenance popup
    setMessage(
      "Maaf, fitur beli sekarang sedang dalam maintenance dan belum bisa digunakan.",
    );
    setPopupType("error");
    setShowPopup(true);
    return;

    // Original code (commented out during maintenance)
    // if (!product) return;

    // const item: CartItemData = {
    //   id: product.id ?? 0,
    //   products_id: product.id ?? 0,
    //   imageUrl: product.image ?? "",
    //   name: product.name ?? "",
    //   partnerName: product.partner?.name ?? "",
    //   price: Number(product.price),
    //   quantity: quantity, // Use the selected quantity
    //   selected: true,
    //   fromCart: false,
    //   weight: product.weight ?? 0, // Tambahkan berat jika ada
    //   inventory: Number(product?.inventory?.stock)
    // };

    // useCartStore.getState().setCartItems([item]);
    // router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto p-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto">
            <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Skeleton untuk Gambar Produk */}
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                      <div className="aspect-square relative">
                        <Skeleton height="100%" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skeleton untuk Info Produk */}
                <div className="space-y-6">
                  {/* Header Produk Skeleton */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton width={30} height={20} />
                      <Skeleton
                        width={120}
                        height={28}
                        className="rounded-full"
                      />
                    </div>

                    <Skeleton height={32} count={2} />

                    <div className="flex items-center gap-4">
                      <Skeleton width={120} height={28} />
                      <Skeleton
                        width={100}
                        height={28}
                        className="rounded-full"
                      />
                    </div>
                  </div>

                  {/* Deskripsi Skeleton */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton width={24} height={24} />
                      <Skeleton width={150} height={24} />
                    </div>
                    <Skeleton height={20} count={4} />
                  </div>

                  {/* Stok Info Skeleton */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <Skeleton width={24} height={24} />
                      <Skeleton width={180} height={20} />
                    </div>
                  </div>

                  {/* Quantity Selector Skeleton */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <Skeleton width={120} height={24} className="mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton
                        width={180}
                        height={50}
                        className="rounded-xl"
                      />
                      <div className="text-right">
                        <Skeleton width={80} height={16} className="mb-1" />
                        <Skeleton width={100} height={24} />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="space-y-3">
                    <Skeleton height={48} className="rounded-xl" />
                    <Skeleton height={48} className="rounded-xl" />
                  </div>

                  {/* Additional Info Skeleton */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton width={24} height={24} />
                      <div className="flex-1">
                        <Skeleton width={150} height={16} className="mb-2" />
                        <Skeleton height={14} count={3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SkeletonTheme>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md shadow-lg"
          role="alert"
        >
          <strong className="font-medium">Gagal Memuat Produk:</strong>
          <p>{error}</p>
          <p className="text-sm mt-2">
            Silakan coba lagi nanti atau hubungi dukungan.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <p className="text-lg text-gray-600">Produk tidak ditemukan.</p>
      </div>
    );
  }

  // --- Mulai JSX untuk tampilan produk ---
  return (
    <div className="min-h-screen bg-secondary">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}

      <div className="container mx-auto p-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Kolom Kiri: Gambar Produk */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="aspect-square relative">
                    <img
                      src={
                        product.image ||
                        "https://via.placeholder.com/600x600.png?text=Gambar+Produk"
                      }
                      alt={product.name || "Gambar Produk"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Info Produk */}
            <div className="space-y-6">
              {/* Header Produk */}
              <div className="space-y-3">
                {product.partner?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Oleh</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.partner.name}
                    </span>
                  </div>
                )}

                <h1 className="text-lg font-medium text-gray-900 leading-tight">
                  {product.name || "Nama Produk Tidak Tersedia"}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="text-lg font-medium text-green-600">
                    {typeof product.price === "number"
                      ? formatCurrency(product.price)
                      : "Harga Tidak Tersedia"}
                  </div>
                  {typeof product.sold === "number" && (
                    <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      {product.sold.toLocaleString("id-ID")} terjual
                    </div>
                  )}
                </div>
              </div>

              {/* Deskripsi */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <NotebookPen size={18} /> Deskripsi Produk
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description || "Deskripsi tidak tersedia."}
                  </p>
                </div>
              </div>

              {/* Stok Info */}
              {typeof product.inventory?.stock === "number" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-amber-600" />
                    <span className="text-amber-800 font-medium">
                      Stok tersedia: {product.inventory.stock} unit
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pilih Jumlah
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={handleDecrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Kurangi Kuantitas"
                    >
                      −
                    </button>
                    <div className="px-6 py-3 bg-gray-50 border-l border-r border-gray-300 min-w-[80px] text-center">
                      <span className="text-lg font-medium text-gray-900">
                        {quantity}
                      </span>
                    </div>
                    <button
                      onClick={handleIncrementQuantity}
                      disabled={quantity >= (product.inventory?.stock || 99)}
                      className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Tambah Kuantitas"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total Harga</div>
                    <div className="text-lg font-medium text-green-600">
                      {typeof product.price === "number"
                        ? formatCurrency(product.price * quantity)
                        : "−"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="cursor-pointer w-full p-2 bg-primary text-white rounded-xl  hover:-translate-y-1 duration-150 ease-in flex items-center justify-center gap-3"
                >
                  <Wallet size={18} />
                  Beli Sekarang
                </button>

                <button
                  onClick={() => handleAddToCart(product.id ?? 0)}
                  className="cursor-pointer w-full p-2 border border-primary  rounded-xl hover:-translate-y-1 duration-150 ease-in flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={18} />
                  Masukkan Keranjang
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb size={18} className="text-blue-600" />
                  <div className="text-blue-800 text-sm">
                    <p className="font-medium mb-1">Informasi Pembelian:</p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        • Gratis ongkir untuk pembelian di atas Rp 100.000
                      </li>
                      <li>• Garansi kualitas produk terjamin</li>
                      <li>• Customer service siap membantu 24/7</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
