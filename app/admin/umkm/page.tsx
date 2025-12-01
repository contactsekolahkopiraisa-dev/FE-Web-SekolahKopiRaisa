// app/admin/umkm/page.tsx
"use client";
import { useState, useEffect } from "react";
import Popup from "@/components/Popup";
import { getAllUMKM } from "@/app/utils/auth";
import Swal from "sweetalert2";

interface UMKM {
  id_umkm: number;
  id_users: number;
  nama_umkm: string;
  ktp: string;
  sertifikat_halal?: string;
  status_verifikasi?: string;
  User?: {
    name?: string;
    email?: string;
    addresses?: Array<{
      id_address?: number;
      id_desa?: number;
      alamat?: string;
      kode_pos?: string;
    }>;
  };
  addresses?: Array<{
    id_address?: number;
    id_desa?: number;
    alamat?: string;
    kode_pos?: string;
  }>;
}

export default function UmkmAdmin() {
  const [data, setData] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Fetch UMKM data
  const fetchUMKMData = async () => {
    try {
      setLoading(true);
      const response = await getAllUMKM({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined
      });

      if (response && response.data) {
        let umkmData: UMKM[] = [];

        if (Array.isArray(response.data)) {
          umkmData = response.data;
        } else if (response.data.umkm && Array.isArray(response.data.umkm)) {
          umkmData = response.data.umkm;
          setTotalPages(response.data.totalPages || 1);
        }

        const pendingData = umkmData.filter(
          (item) => item.status_verifikasi === "Pending"
        );

        setData(pendingData);

        if (Array.isArray(response.data)) {
          setTotalPages(Math.ceil(pendingData.length / itemsPerPage) || 1);
        }
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error("Error fetching UMKM:", error);
      setMessage(error.message || "Gagal memuat data UMKM");
      setPopupType("error");
      setShowPopup(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUMKMData();
  }, [currentPage, searchTerm]);

  const handleApprove = async (id: number) => {
    const umkm = data.find((item) => item.id_umkm === id);
    if (!umkm) return;

    const result = await Swal.fire({
      title: "Setujui UMKM",
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 15px;">Apakah Anda yakin ingin menyetujui UMKM <strong>${umkm.nama_umkm}</strong>?</p>
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Alasan Persetujuan (Opsional):</label>
        </div>
      `,
      input: "textarea",
      inputPlaceholder: "Masukkan alasan persetujuan (opsional)...",
      inputAttributes: {
        style: "min-height: 100px; resize: vertical;"
      },
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      showLoaderOnConfirm: true,
      preConfirm: async (alasan) => {
        try {
          // Call API to approve UMKM
          const response = await fetch(`/api/admin/umkm/${id}/approve`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              alasan: alasan || "UMKM Anda telah disetujui.",
              email: umkm.User?.email,
              nama_umkm: umkm.nama_umkm
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal menyetujui UMKM");
          }

          return await response.json();
        } catch (error: any) {
          Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isConfirmed) {
      await fetchUMKMData();
      Swal.fire({
        title: "Berhasil!",
        text: `UMKM ${umkm.nama_umkm} telah disetujui dan email notifikasi telah dikirim.`,
        icon: "success",
        confirmButtonColor: "#10b981"
      });
    }
  };

  const handleReject = async (id: number) => {
    const umkm = data.find((item) => item.id_umkm === id);
    if (!umkm) return;

    const result = await Swal.fire({
      title: "Tolak UMKM",
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 15px;">Apakah Anda yakin ingin menolak UMKM <strong>${umkm.nama_umkm}</strong>?</p>
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #dc2626;">Alasan Penolakan (Wajib):</label>
        </div>
      `,
      input: "textarea",
      inputPlaceholder: "Masukkan alasan penolakan...",
      inputAttributes: {
        style: "min-height: 100px; resize: vertical;"
      },
      inputValidator: (value) => {
        if (!value) {
          return "Alasan penolakan wajib diisi!";
        }
        if (value.length < 10) {
          return "Alasan penolakan minimal 10 karakter!";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Ya, Tolak",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      showLoaderOnConfirm: true,
      preConfirm: async (alasan) => {
        try {
          // Call API to reject UMKM
          const response = await fetch(`/api/admin/umkm/${id}/reject`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              alasan: alasan,
              email: umkm.User?.email,
              nama_umkm: umkm.nama_umkm
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal menolak UMKM");
          }

          return await response.json();
        } catch (error: any) {
          Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isConfirmed) {
      await fetchUMKMData();
      Swal.fire({
        title: "Berhasil!",
        text: `UMKM ${umkm.nama_umkm} telah ditolak dan email notifikasi telah dikirim.`,
        icon: "success",
        confirmButtonColor: "#10b981"
      });
    }
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUMKMData();
  };

  return (
    <div className="p-4 sm:p-6">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sertifikat Halal</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Sertifikat Halal"
                className="w-full h-auto"
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Manajemen UMKM
        </h1>
        <p className="text-gray-600">
          Kelola persetujuan dan penolakan pendaftaran UMKM
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama UMKM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  No
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Nama UMKM
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Nama Pemilik
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  NIK
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Sertifikat Halal
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Alamat
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id_umkm} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.nama_umkm}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.User?.name}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.ktp}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.sertifikat_halal ? (
                        <a
                          href={item.sertifikat_halal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                        >
                          File Sertifikat
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">
                          File Sertifikat tidak tersedia
                        </span>
                      )}
                    </td>
                    <td
                      className="px-2 sm:px-4 py-3 max-w-xs truncate"
                      title={
                        item.User?.addresses?.[0]?.alamat ||
                        item.addresses?.[0]?.alamat ||
                        "-"
                      }
                    >
                      {item.User?.addresses?.[0]?.alamat ||
                        item.addresses?.[0]?.alamat ||
                        "-"}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(item.id_umkm)}
                          className="cursor-pointer px-3 py-2 text-white text-xs sm:text-sm rounded-lg bg-primary hover:-translate-y-1 duration-150 ease-in"
                          title="Setuju"
                        >
                          Setuju
                        </button>
                        <button
                          onClick={() => handleReject(item.id_umkm)}
                          className="cursor-pointer px-3 py-2 text-white text-xs sm:text-sm rounded-lg bg-red-600 hover:-translate-y-1 duration-150 ease-in"
                          title="Tolak"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Tidak ada data yang sesuai dengan pencarian"
                      : "Tidak ada data UMKM yang perlu disetujui"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && data.length > 0 && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
