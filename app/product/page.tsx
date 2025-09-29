"use client";

import { use, useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { fetchAllProduct } from "../utils/product";
import { ProductItem } from "../types/productType";
import { useRouter } from "next/navigation";
import { Box, Search } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "../../components/main/Footer";

export default function ProductPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();
  const handleViewDetails = (id: number) => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiResult = await fetchAllProduct();

        if (apiResult && apiResult.data) {
          setProducts(apiResult.data);
          setFilteredProducts(apiResult.data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
          console.warn(
            "Struktur data dari fetchAllProduct tidak sesuai harapan:",
            apiResult
          );
        }
      } catch (err: any) {
        console.error("Error di ProductPage dari fetchAllProduct:", err);
        let errorMessage =
          "Terjadi kesalahan yang tidak diketahui saat mengambil produk.";
        if (err && err.message) {
          errorMessage = err.message;
          if (err.type === "validation" && err.errors) {
            console.error("Detail Validasi:", err.errors);
          } else if (err.type === "network") {
            console.warn("Terdeteksi error jaringan dari fetchAllProduct");
          }
        } else if (typeof err === "string") {
          errorMessage = err;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
        <div className="min-h-screen">
          {/* Hero Header Section Skeleton */}
          <div className="bg-primary text-white">
            <div className="container mx-auto p-4 py-12 pt-32">
              <div className="text-center mb-8">
                <Skeleton height={28} width={250} className="mx-auto mb-4" />
                <Skeleton height={16} width={400} className="mx-auto" />
              </div>

              {/* Search Bar Skeleton */}
              <div className="max-w-md mx-auto">
                <Skeleton height={42} className="rounded-xl" />
              </div>
            </div>
          </div>

          {/* Stats Section Skeleton */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto p-4 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton height={20} width={200} />
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                  <Skeleton height={32} width={120} className="rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="container mx-auto p-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <Skeleton height={200} className="mb-4" />
                  <div className="p-4">
                    <Skeleton height={20} className="mb-2" />
                    <Skeleton height={16} width="60%" className="mb-2" />
                    <Skeleton height={24} width="40%" className="mb-3" />
                    <Skeleton height={36} className="rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="max-w-lg w-full">
              <div className="bg-white border border-red-200 rounded-2xl shadow-lg p-8 text-center">
                <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Oops! Terjadi Kesalahan
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="text-center max-w-md">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Belum Ada Produk
              </h3>
              <p className="text-gray-600 mb-6">
                Produk sedang dalam proses persiapan. Silakan kembali lagi
                nanti!
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Refresh Halaman
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Hero Header Section */}
      <div className="bg-primary text-white">
        <div className="container mx-auto p-4 py-12 pt-32">
          <div className="text-center mb-8">
            <h1 className="text-lg font-medium mb-4">Koleksi Produk Kami</h1>
            <p className="text-sm text-blue-100 max-w-2xl mx-auto">
              Temukan berbagai produk berkualitas tinggi dari Sekolah Kopi Raisa
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-gray-300">
        <div className="container mx-auto p-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} dari {products.length} produk
                  ditampilkan
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 gap-2">
                <Box width={15} className="" /> {products.length} Total Produk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - Tambahkan flex-1 untuk mengisi ruang kosong */}
      <div className="flex-1">
        <div className="container mx-auto p-4 py-8">
          {filteredProducts.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Search size={15} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ditemukan
              </h3>
              <p className="text-gray-600 mb-4">
                Tidak ada produk yang cocok dengan pencarian "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Hapus filter pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className=""
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    sold={product.sold}
                    price={product.price}
                    onView={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Sekarang akan berada di bagian bawah */}
      <Footer />
    </div>
  );
}
