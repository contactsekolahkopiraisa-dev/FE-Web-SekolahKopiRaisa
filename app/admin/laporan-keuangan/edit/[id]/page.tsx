// app/admin/laporan-keuangan/edit/[id]/page.tsx
"use client";

import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/components/Popup";
import CalendarForm from "@/components/CalenderForm";
import { useRouter, useParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { dummyLaporanKeuangan } from "@/lib/dummyLaporanKeuangan";

export default function EditLaporanKeuanganAdmin() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [pemasukan, setPemasukan] = useState("");
  const [pengeluaran, setPengeluaran] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Helper function untuk parse tanggal Indonesia
  const parseTanggalIndonesia = (tanggal: string): Date => {
    const bulanMap: { [key: string]: number } = {
      "Januari": 0, "Februari": 1, "Maret": 2, "April": 3,
      "Mei": 4, "Juni": 5, "Juli": 6, "Agustus": 7,
      "September": 8, "Septemberrr": 8, "Oktober": 9, "November": 10, "Desember": 11
    };
    
    const parts = tanggal.split(" ");
    const hari = parseInt(parts[0]);
    const bulan = bulanMap[parts[1]];
    const tahun = parseInt(parts[2]);
    
    return new Date(tahun, bulan, hari);
  };

  // Load data saat component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulasi delay loading
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Cari data berdasarkan ID
        const laporanData = dummyLaporanKeuangan.find(
          (item) => item.id === parseInt(id)
        );

        if (laporanData) {
          // Set data ke form
          const date = parseTanggalIndonesia(laporanData.tanggal);
          setSelectedDate(date);
          setDescription(laporanData.keterangan);
          setPemasukan(formatRupiah(laporanData.pemasukan.toString()));
          setPengeluaran(formatRupiah(laporanData.pengeluaran.toString()));
        } else {
          // Jika data tidak ditemukan
          setMessage("Data laporan keuangan tidak ditemukan.");
          setPopupType("error");
          setShowPopup(true);
          setTimeout(() => {
            router.push("/admin/laporan-keuangan");
          }, 2000);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setMessage("Terjadi kesalahan saat memuat data.");
        setPopupType("error");
        setShowPopup(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, router]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validasi sederhana
    const newErrors: Record<string, string> = {};
    if (!selectedDate) newErrors.date = "Tanggal laporan harus diisi";
    if (!description.trim()) newErrors.description = "Keterangan harus diisi";
    if (!pemasukan.trim()) newErrors.pemasukan = "Pemasukan harus diisi";
    if (!pengeluaran.trim()) newErrors.pengeluaran = "Pengeluaran harus diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tampilkan modal konfirmasi
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulasi API call dengan delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Data dummy untuk submit
      const formData = {
        id: parseInt(id),
        date: selectedDate,
        description,
        pemasukan: parseFloat(pemasukan.replace(/[^0-9]/g, "")),
        pengeluaran: parseFloat(pengeluaran.replace(/[^0-9]/g, "")),
      };

      console.log("Data yang akan diupdate:", formData);

      // Tutup modal konfirmasi
      setShowConfirmModal(false);

      // Tampilkan popup sukses
      setMessage("Berhasil Diperbarui! Perubahan laporan berhasil disimpan.");
      setPopupType("success");
      setShowPopup(true);

      // Tunggu 2 detik, kemudian redirect
      setTimeout(() => {
        router.push("/admin/laporan-keuangan");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setShowConfirmModal(false);
      setMessage("Terjadi kesalahan saat memperbarui laporan keuangan.");
      setPopupType("error");
      setShowPopup(true);
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (value: string) => {
    const number = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseInt(number) || 0);
  };

  // Tampilkan loading state
  if (isLoading) {
    return (
      <div className="pl-6 pr-50 py-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-6 pr-50 py-6">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Perbarui Laporan Keuangan"
        description="Apakah Anda yakin ingin memperbarui laporan keuangan ini? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />
      <form onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-bold mb-6">Edit Laporan Keuangan</h1>
        
        <CalendarForm
          selectedDate={selectedDate}
          onDateChange={(date) => {
            setSelectedDate(date);
            setErrors((prev) => ({ ...prev, date: "" }));
          }}
          error={errors.date}
          label="Tanggal Laporan"
        />

        <div className="mb-4">
          <label className="block text-xl font-medium mb-2" htmlFor="description">
            Keterangan
          </label>
          <textarea
            id="description"
            rows={8}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Masukkan keterangan"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xl font-medium mb-2" htmlFor="pemasukan">
            Pemasukan
          </label>
          <input
            type="text"
            id="pemasukan"
            value={pemasukan}
            onChange={(e) => {
              setPemasukan(formatRupiah(e.target.value));
              setErrors((prev) => ({ ...prev, pemasukan: "" }));
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan pemasukan"
          />
          {errors.pemasukan && (
            <p className="text-sm text-red-600 mt-1">{errors.pemasukan}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xl font-medium mb-2" htmlFor="pengeluaran">
            Pengeluaran
          </label>
          <input
            type="text"
            id="pengeluaran"
            value={pengeluaran}
            onChange={(e) => {
              setPengeluaran(formatRupiah(e.target.value));
              setErrors((prev) => ({ ...prev, pengeluaran: "" }));
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan pengeluaran"
          />
          {errors.pengeluaran && (
            <p className="text-sm text-red-600 mt-1">{errors.pengeluaran}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button
            type="button"
            onClick={() => router.push("/admin/laporan-keuangan")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin w-4 h-4" />
                Memproses...
              </>
            ) : (
              "Perbarui Laporan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}