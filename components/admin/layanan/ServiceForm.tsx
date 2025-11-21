"use client";
import { useState } from "react";
import { Upload, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { TargetPesertaItem } from "@/app/types/jenisLayananType";

interface ServiceFormProps {
  initialData?: {
    nama: string;
    deskripsiLengkap: string;
    deskripsiSingkat: string;
    durasi: string;
    targetPeserta: string;
    image?: string;
  };
  targetPesertaOptions?: TargetPesertaItem[];
  onSubmit: (data: any, file: File | null) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ServiceForm({
  initialData,
  targetPesertaOptions = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: ServiceFormProps) {
  const [formData, setFormData] = useState({
    nama: initialData?.nama || "",
    deskripsiLengkap: initialData?.deskripsiLengkap || "",
    deskripsiSingkat: initialData?.deskripsiSingkat || "",
    durasi: initialData?.durasi || "",
    targetPeserta: initialData?.targetPeserta || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedFile);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Informasi Dasar
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Layanan */}
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Layanan
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            placeholder="Masukkan nama layanan"
          />
        </div>

        {/* Gambar Layanan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Layanan
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
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex flex-col items-center justify-center py-6">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 font-medium">Unggah File</p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG hingga 5MB
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        {/* Deskripsi Lengkap */}
        <div>
          <label
            htmlFor="deskripsiLengkap"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Deskripsi Lengkap
          </label>
          <textarea
            id="deskripsiLengkap"
            name="deskripsiLengkap"
            value={formData.deskripsiLengkap}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Deskripsi yang akan muncul di detail layanan"
          />
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label
            htmlFor="deskripsiSingkat"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Deskripsi Singkat
          </label>
          <input
            type="text"
            id="deskripsiSingkat"
            name="deskripsiSingkat"
            value={formData.deskripsiSingkat}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            placeholder="Deskripsi yang muncul di card"
          />
        </div>

        {/* Durasi */}
        <div>
          <label
            htmlFor="durasi"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Durasi
          </label>
          <input
            type="text"
            id="durasi"
            name="durasi"
            value={formData.durasi}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            placeholder="Contoh : 1 hari, 2-4 bulan"
          />
        </div>

        {/* Target Peserta */}
        <div>
          <label
            htmlFor="targetPeserta"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Target Peserta
          </label>
          <div className="relative">
            <select
              id="targetPeserta"
              name="targetPeserta"
              value={formData.targetPeserta}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition appearance-none bg-white text-gray-900 cursor-pointer"
            >
              <option value="" className="text-gray-500">
                Pilih Target Peserta
              </option>
              {targetPesertaOptions.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                  className="text-gray-900"
                >
                  {option.nama_target}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
