"use client";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchAllPartner,
  deletePartner,
  callPartner,
} from "@/app/utils/partner";
import PartnerTable, {
  PartnerListProps,
} from "@/components/partner/PartnerTable";
import Popup from "@/components/Popup";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminPartnerPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [data, setData] = useState<PartnerListProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const handleAddPartner = () => {
    router.push("/admin/partner/create");
  };

  const hendleDeletePartner = async (id: number) => {
    try {
      const response = await deletePartner(id);
      if (response) {
        setData((prev) => prev.filter((a) => a.id !== id));
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

  const handleEditPartner = (id: number) => {
    router.push(`/admin/partner/edit/${id}`);
  };

  const handlePartnerCall = async (id: number) => {
    try {
      const response = await callPartner(id);
      if (response?.data?.whatsappUrl) {
        window.open(response.data.whatsappUrl, "_blank");
      } else {
        setMessage(message);
        setPopupType("error");
        setShowPopup(true);
      }
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan saat memanggil mitra.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPartners = data.slice(startIndex, endIndex);

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
    const getPartner = async () => {
      try {
        const response = await fetchAllPartner();
        const rawData = response.data;
        const formattedData = rawData.map((item: any) => ({
          id: item.id,
          name: item.name,
          owner_name: item.owner_name,
          phone_number: item.phone_number,
          address: item.address,
          products: item.products
            .map((product: any) => product.name)
            .join(", "),
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching partner data:", error);
        setError("Failed to fetch partner data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    getPartner();
  }, []);

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
        title="Yakin Menghapus Mitra?"
        description="Tindakan ini tidak dapat dibatalkan. Mitra yang dihapus akan secara permanen terhapus dari sistem."
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPartnerToDelete(null);
        }}
        onConfirm={() => {
          if (partnerToDelete !== null) {
            hendleDeletePartner(partnerToDelete);
          }
          setPartnerToDelete(null);
          setShowConfirmModal(false);
        }}
      />
      <div className="conatiner mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-medium ">Daftar Mitra / Partner</h1>

          <button
            className="cursor-pointer bg-primary text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm"
            onClick={handleAddPartner}
          >
            <Plus size={18} />
            <span>Tambah Mitra</span>
          </button>
        </div>
        <div>
          {loading ? (
            <div className="bg-tertiary shadow-lg rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-primary text-xs sm:text-sm text-white">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                        Nama Mitra
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                        Nama Pemilik
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                        No. Telpon
                      </th>

                      <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                        Produk Terdaftar
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm text-gray-700 divide-y divide-gray-200">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-2 sm:px-4 py-3">
                          <div className="h-4 bg-gray-300 rounded w-32"></div>
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <div className="h-4 bg-gray-300 rounded w-28"></div>
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <div className="h-6 bg-gray-300 rounded-xl w-24"></div>
                        </td>

                        <td className="px-2 sm:px-4 py-3">
                          <div className="h-4 bg-gray-300 rounded w-36"></div>
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <div className="h-8 w-8 bg-gray-300 rounded-xl"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <PartnerTable
              partner={currentPartners}
              onDelete={(id: number) => {
                setPartnerToDelete(id);
                setShowConfirmModal(true);
              }}
              onEdit={handleEditPartner}
              onCall={handlePartnerCall}
            />
          )}
        </div>

        {/* Pagination - only show when not loading */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col items-center space-y-4 mt-5">
            {/* Pagination Info */}
            <div className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, data.length)}{" "}
              dari {data.length} mitra
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className=" hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={23} />
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
                          ? "bg-primary text-white border-primary"
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
                className=" hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={23} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
