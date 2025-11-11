"use client";

import { useState } from "react";
import { FileText, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import ModuleDetailModal from "../../../../components/admin/layanan/ModuleDetailModal";
import LayananHeader from "@/components/layanan/LayananHeader";

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

  // Sample data - replace with actual API call
  const modules: Module[] = [
    {
      id: 1,
      title: "Modul 1: Pengenalan Kopi",
      description: "pengetahuan dasar tentang kopi, sejarah kopi",
      image: "/assets/coffee.jpg",
      moduleFile: "/assets/modul1.pdf",
    },
    {
      id: 2,
      title: "Modul 2: Proses Roasting",
      description: "dasar-dasar roasting dan profil rasa",
      image: "/assets/coffee.jpg",
      moduleFile: "/assets/modul2.pdf",
    },
    {
      id: 3,
      title: "Modul 3: Brewing",
      description: "metode seduh dan teknik ekstraksi",
      image: "/assets/coffee.jpg",
      moduleFile: "/assets/modul3.pdf",
    },
    {
      id: 4,
      title: "Modul 4: Cupping",
      description: "evaluasi citarasa dan aroma kopi",
      image: "/assets/coffee.jpg",
      moduleFile: "/assets/modul4.pdf",
    },
    {
      id: 5,
      title: "Modul 5: Latte Art",
      description: "teknik membuat latte art dan dekorasi kopi",
      image: "/assets/coffee.jpg",
      moduleFile: "/assets/modul5.pdf",
    },
    {
      id: 6,
      title: "Modul 6: Manajemen Barista",
      description: "manajemen operasional dan pelayanan pelanggan",
      image: "/assets/coffee.jpg",
      moduleFile: "/assets/modul6.pdf",
    },
  ];

  const handleView = (module: Module) => {
    if (module.moduleFile) {
      window.open(module.moduleFile, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedModule(module); // fallback to modal if no file
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
      // TODO: Call API to delete module
      await Swal.fire({
        icon: "success",
        title: "Modul Berhasil Dihapus",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
      // TODO: Refresh module list
    }
  };

  return (
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <LayananHeader title="Modul Sekolah Kopi Raisa" subtitle="Kelola dan Review Setiap Modul" />
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <Link href="/admin/layanan/modul/tambah">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              <Plus size={18} />
              Tambah Modul
            </button>
          </Link>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full h-40 sm:w-32 sm:h-32 flex-shrink-0">
                  <img
                    src={module.image}
                    alt={module.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText size={16} className="text-gray-500 mt-0.5" />
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {module.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                    {module.description}
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
                    <Link href={`/admin/layanan/modul/edit/${module.id}`} className="flex-1 min-w-[110px]">
                      <button className="w-full py-2 px-3 text-xs rounded-md bg-amber-900 text-white hover:bg-amber-950 transition-all flex items-center justify-center gap-1.5 font-medium">
                        <Pencil size={14} />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(module.id, module.title)}
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
