"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload } from "lucide-react";
import Swal from "sweetalert2";
import { fetchModulById, updateModul } from "@/app/utils/modul";

export default function EditModulPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    judul_modul: "",
    deskripsi: "",
  });
  const [moduleFile, setModuleFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [currentFileUrl, setCurrentFileUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch module data on mount
  const fetchModule = useCallback(async () => {
    try {
      if (!params.id) {
        console.warn("params.id is undefined");
        throw new Error("ID modul tidak ditemukan");
      }
      console.log("Fetching module with ID:", params.id);
      const moduleData = await fetchModulById(Number(params.id));
      console.log("Module data loaded:", moduleData);

      setFormData({
        judul_modul: moduleData.judul_modul,
        deskripsi: moduleData.deskripsi,
      });
      setCurrentFileUrl(moduleData.file_modul);
      if (moduleData.logo_judul) {
        setLogoPreview(moduleData.logo_judul);
      }
    } catch (error: any) {
      console.error("Error fetching module:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message || "Terjadi kesalahan saat memuat data modul",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
      router.push("/admin/layanan/modul");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    console.log("useEffect triggered, params.id:", params.id);
    if (params.id) {
      fetchModule();
    } else {
      console.warn("params.id is undefined in useEffect");
      setIsLoading(false);
    }
  }, [params.id, fetchModule]);

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

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!params.id) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID modul tidak valid",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateModul(Number(params.id), {
        judul_modul: formData.judul_modul,
        deskripsi: formData.deskripsi,
        file_modul: moduleFile || undefined,
        foto_sampul: logoFile || undefined,
      });

      await Swal.fire({
        icon: "success",
        title: "Modul Berhasil Diperbarui",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });

      router.push("/admin/layanan/modul");
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui Modul",
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Edit Modul
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Judul (Opsional) */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Sampul Modul
              </label>
              <div className="flex items-start gap-4">
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition bg-neutral-50"
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                      {logoFile ? "Gambar Dipilih" : "Unggah Gambar (PNG/JPG)"}
                    </p>
                    {logoFile && (
                      <p className="text-xs text-gray-400 mt-1">
                        {logoFile.name}
                      </p>
                    )}
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoFileChange}
                  />
                </label>
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Preview Logo"
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maksimal 2MB. Format: JPG, PNG.
              </p>
            </div>
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

            {/* File Modul Saat Ini */}
            {currentFileUrl && !moduleFile && (
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  File Modul Saat Ini
                </label>
                <a
                  href={currentFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Upload size={16} />
                  Lihat file modul saat ini
                </a>
              </div>
            )}

            {/* Modul */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Modul{" "}
                {moduleFile
                  ? "(File Baru)"
                  : "(Opsional - Kosongkan jika tidak ingin mengubah)"}
              </label>
              <label
                htmlFor="module-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition bg-neutral-50"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">
                    {moduleFile ? "File Dipilih" : "Unggah File Baru (PDF/DOC)"}
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
