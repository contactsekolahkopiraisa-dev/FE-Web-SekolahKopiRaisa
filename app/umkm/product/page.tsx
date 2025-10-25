"use client";

import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/components/Popup";
import ProductListAdmin from "@/components/product/ProductListAdmin";
import { ProductItem } from "@/app/types/productType";

import { deleteProduct, fetchAllProduct } from "@/app/utils/product";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AdminProductPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const [product, setProduct] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 items per page for grid layout

  const handleAddProduct = () => {
    router.push("/admin/product/create");
  };

  const handleViewProduct = (id: number) => {
    router.push(`/admin/product/${id}`);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await deleteProduct(id);
      if (response) {
        setProduct((prev) => prev.filter((a) => a.id !== id));
        setMessage(response.message);
        setPopupType("success");
        setShowPopup(true);
      }
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan saat menghapus.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const handleEditProduct = (id: number) => {
    router.push(`/admin/product/edit/${id}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(product.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = product.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    const popupData = sessionStorage.getItem("popup");
    if (popupData) {
      const { message, type } = JSON.parse(popupData);
      setMessage(message);
      setPopupType(type);
      setShowPopup(true);
      sessionStorage.removeItem("popup");
    }
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllProduct();
        const rawData = response.data;
        const formattedData = rawData.map((item: any) => ({
          id: item.id,
          image: item.image,
          name: item.name,
          price: item.price,
          stock: item.inventory.stock,
          weight: item.weight || 0,
          sold: item.sold || 0,
          partner: item.partner || { name: "Tidak Diketahui" }, // Ensure partner is always defined
        }));
        setProduct(formattedData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Reset to page 1 when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [product.length]);

  return (
    <div className="mx-auto">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Yakin Menghapus Produk?"
        description="Tindakan ini tidak dapat dibatalkan. Produk yang dihapus akan secara permanen terhapus dari sistem."
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setProductToDelete(null);
        }}
        onConfirm={() => {
          if (productToDelete !== null) {
            handleDeleteProduct(productToDelete);
          }
          setShowConfirmModal(false);
          setProductToDelete(null);
        }}
      />
      <div className="flex justify-between mb-4 sm:mb-6">
        <h1 className="text-lg font-medium text-gray-800">
          Daftar Produk
          {!loading && product.length > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({product.length} produk)
            </span>
          )}
        </h1>
        <button
          className="cursor-pointer bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm"
          onClick={handleAddProduct}
        >
          <Plus size={18} />
          <span>Tambah Produk</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg border border-gray-300 p-3 flex flex-col justify-between bg-white relative animate-pulse"
            >
              {/* Availability Badge Skeleton */}
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-gray-200 h-5 w-16 rounded"></div>
              </div>

              {/* Image Skeleton */}
              <div className="h-50 bg-gray-200 rounded-xl"></div>

              <div className="mt-3 flex flex-col justify-between flex-grow text-sm">
                <div>
                  <div className="flex justify-between items-start">
                    {/* Kolom Kiri Skeleton */}
                    <div className="flex flex-col space-y-2">
                      <div className="bg-gray-200 h-5 w-32 rounded"></div>
                      <div className="bg-gray-200 h-4 w-24 rounded"></div>
                      <div className="bg-gray-200 h-3 w-20 rounded"></div>
                    </div>

                    {/* Kolom Kanan Skeleton */}
                    <div className="flex flex-col space-y-2 text-right">
                      <div className="bg-gray-200 h-3 w-16 rounded ml-auto"></div>
                      <div className="bg-gray-200 h-4 w-12 rounded ml-auto"></div>
                      <div className="bg-gray-200 h-3 w-14 rounded ml-auto"></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-3">
                  {/* Edit Button Skeleton */}
                  <div className="bg-gray-200 h-10 w-10 rounded-xl"></div>
                  {/* Delete Button Skeleton */}
                  <div className="bg-gray-200 h-10 w-10 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-8">
            {error}
          </div>
        ) : product.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            Belum ada produk yang tersedia
          </div>
        ) : (
          currentProducts.map((product, index) => (
            <ProductListAdmin
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              stock={product.stock}
              weight={product.weight}
              sold={product.sold}
              partner={product.partner}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={(id) => {
                setProductToDelete(id);
                setShowConfirmModal(true);
              }}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && product.length > 0 && totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 mt-8">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, product.length)}{" "}
            dari {product.length} produk
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => goToPage(page as number)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm ${
                      currentPage === page
                        ? "bg-amber-950 text-white border-amber-950"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
