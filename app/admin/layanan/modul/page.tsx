"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import ModuleDetailModal from "../../../../components/admin/layanan/ModuleDetailModal";
import LayananHeader from "@/components/layanan/LayananHeader";
import { fetchAllModul, deleteModul } from "@/app/utils/modul";
import { ModulItem } from "@/app/types/modulType";

interface Module {
  id: number;
  title: string;
  description: string;
  image: string;
  moduleFile?: string;
}

export default function AdminLayananModulPage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState<ModulItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Fetch modules from API
  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setIsLoading(true);
      console.log("Loading modules...");
      const data = await fetchAllModul();
      console.log("Modules loaded:", data);
      setModules(data);
    } catch (error: any) {
      console.error("Error in loadModules:", error);
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message || "Terjadi kesalahan saat memuat data modul",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to first page when modules change
  useEffect(() => {
    setCurrentPage(1);
  }, [modules]);

  const handleView = (module: ModulItem) => {
    if (module.file_modul) {
      window.open(module.file_modul, "_blank", "noopener,noreferrer");
      return;
    }
    // Convert ModulItem to Module for modal
    const modalData: Module = {
      id: module.id,
      title: module.judul_modul,
      description: module.deskripsi,
      image: "/assets/coffee.jpg", // default image
      moduleFile: module.file_modul,
    };
    setSelectedModule(modalData);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Hapus Modul?",
      html: `Apakah Anda yakin ingin menghapus <b>${title}</b>?`,
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus",
      confirmButtonColor: "#4E342E",
      customClass: { popup: "rounded-xl" },
    });

    if (result.isConfirmed) {
      try {
        await deleteModul(id);
        await Swal.fire({
          icon: "success",
          title: "Modul Berhasil Dihapus",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
        // Refresh module list
        await loadModules();
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Modul",
          text: error.message || "Terjadi kesalahan saat menghapus modul",
          confirmButtonColor: "#4E342E",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <LayananHeader
        title="Modul Sekolah Kopi Raisa"
        subtitle="Kelola dan Review Setiap Modul"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-900" />
            <p className="text-sm font-semibold text-gray-800">
              Memuat data...
            </p>
            <p className="text-xs text-gray-500">
              Mohon tunggu, sedang mengambil daftar modul.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && modules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Belum ada modul</p>
          <p className="text-gray-400 text-sm">Tambahkan modul pertama Anda</p>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
            <Link href="/admin/layanan/modul/tambah">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition-colors font-medium">
                <Plus size={18} />
                Tambah Modul
              </button>
            </Link>
          </div>

          {/* Module Cards Grid with pagination */}
          {modules.length > 0 && (
            <>
              {(() => {
                const totalPages = Math.ceil(modules.length / ITEMS_PER_PAGE);
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const visible = modules.slice(
                  startIndex,
                  startIndex + ITEMS_PER_PAGE
                );
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {visible.map((module) => (
                        <div
                          key={module.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                        >
                          <div className="flex flex-col sm:flex-row">
                            {/* Image */}
                            <div className="w-full h-40 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100">
                              <img
                                src={module.foto_sampul || "/assets/coffee.jpg"} // ✅ Gunakan foto_sampul atau fallback
                                alt={module.judul_modul}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback jika gambar gagal load
                                  e.currentTarget.src = "/assets/coffee.jpg";
                                }}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 flex flex-col">
                              <div className="flex items-start gap-2 mb-2">
                                <FileText
                                  size={16}
                                  className="text-gray-500 mt-0.5"
                                />
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {module.judul_modul}
                                </h3>
                              </div>
                              <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                                {module.deskripsi}
                              </p>

                              {/* Action Buttons */}
                              <div className="mt-auto flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleView(module)}
                                  className="flex-1 min-w-[110px] py-2 px-3 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-1.5 font-medium"
                                >
                                  <Eye size={14} />
                                  Lihat
                                </button>
                                <Link
                                  href={`/admin/layanan/modul/edit/${module.id}`}
                                  className="flex-1 min-w-[110px]"
                                >
                                  <button className="w-full py-2 px-3 text-xs rounded-md bg-amber-900 text-white hover:bg-amber-950 transition-all flex items-center justify-center gap-1.5 font-medium">
                                    <Pencil size={14} />
                                    Edit
                                  </button>
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDelete(module.id, module.judul_modul)
                                  }
                                  className="flex-1 min-w-[110px] py-2 px-3 text-xs rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all flex items-center justify-center gap-1.5 font-medium"
                                >
                                  <Trash2 size={14} />
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm rounded-lg ${
                                currentPage === page
                                  ? "bg-amber-900 text-white"
                                  : "bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={currentPage >= totalPages}
                          className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </>
      )}

      {/* Modal */}
      {selectedModule && (
        <ModuleDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          module={selectedModule}
        />
      )}
    </div>
  );
}
