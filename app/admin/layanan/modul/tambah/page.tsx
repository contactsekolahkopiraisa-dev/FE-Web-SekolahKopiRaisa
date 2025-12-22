"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import Swal from "sweetalert2";
import { createModul } from "@/app/utils/modul";

export default function TambahModulPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    judul_modul: "",
    deskripsi: "",
  });
  const [moduleFile, setModuleFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModuleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModuleFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi file modul
    if (!moduleFile) {
      await Swal.fire({
        icon: "warning",
        title: "File Modul Diperlukan",
        text: "Silakan unggah file modul terlebih dahulu.",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createModul({
        judul_modul: formData.judul_modul,
        deskripsi: formData.deskripsi,
        file_modul: moduleFile,
      });

      await Swal.fire({
        icon: "success",
        title: "Modul Berhasil Disimpan",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });

      router.push("/admin/layanan/modul");
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Modul",
        text: error.message || "Silakan coba lagi.",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Tambah Modul
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul Modul */}
            <div>
              <label
                htmlFor="judul_modul"
                className="block text-sm font-medium text-amber-900 mb-2"
              >
                Judul Modul
              </label>
              <input
                type="text"
                id="judul_modul"
                name="judul_modul"
                value={formData.judul_modul}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="Contoh : 'Modul 1 : Pengenalan Kopi'"
              />
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label
                htmlFor="deskripsi"
                className="block text-sm font-medium text-amber-900 mb-2"
              >
                Deskripsi Singkat
              </label>
              <input
                type="text"
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="Deskripsi singkat modul yang ditampilkan"
              />
            </div>

            {/* Modul */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Modul
              </label>
              <label
                htmlFor="module-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition bg-neutral-50"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">
                    Unggah File
                  </p>
                  {moduleFile && (
                    <p className="text-xs text-gray-400 mt-1">
                      {moduleFile.name}
                    </p>
                  )}
                </div>
                <input
                  id="module-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleModuleFileChange}
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-white border border-amber-900 text-amber-900 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
