"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function EditModulPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [moduleFile, setModuleFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch module data on mount
  useEffect(() => {
    const fetchModule = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Sample data - replace with API response
        const moduleData = {
          id: params.id,
          title: "Modul 1: Pengenalan Kopi",
          description: "pengetahuan dasar tentang kopi, sejarah kopi",
          image: "/assets/coffee.jpg",
        };

        setFormData({
          title: moduleData.title,
          description: moduleData.description,
        });
        setImagePreview(moduleData.image);
      } catch (error) {
        console.error("Error fetching module:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchModule();
    }
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModuleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModuleFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Submit to API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await Swal.fire({
        icon: "success",
        title: "Modul Berhasil Diperbarui",
        confirmButtonColor: "#4E342E",
        customClass: { popup: "rounded-xl" },
      });

      router.push("/admin/layanan/modul");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui Modul",
        text: "Silakan coba lagi.",
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
            {/* Judul Modul */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-amber-900 mb-2"
              >
                Judul Modul
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="Contoh : 'Modul 1 : Pengenalan Kopi'"
              />
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-amber-900 mb-2"
              >
                Deskripsi Singkat
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="Deskripsi singkat modul yang ditampilkan"
              />
            </div>

            {/* Gambar Modul */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Gambar Modul
              </label>
              {imagePreview ? (
                <div className="relative w-full h-64 border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition bg-neutral-50"
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                      Unggah File
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
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

