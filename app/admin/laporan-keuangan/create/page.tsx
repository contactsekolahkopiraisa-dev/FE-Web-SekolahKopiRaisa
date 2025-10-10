"use client";

import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/components/Popup";
import CalendarPicker from "@/components/CalenderPicker";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect, useRef } from "react";
import { LoaderCircle, Calendar } from "lucide-react";

export default function CreateLaporanKeuanganAdmin() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState("");
  const [pemasukan, setPemasukan] = useState("");
  const [pengeluaran, setPengeluaran] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const getDisplayText = () => {
    if (!selectedDate) return "Pilih Tanggal Laporan";
    const bulanNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const tanggal = selectedDate.getDate();
    const bulan = bulanNames[selectedDate.getMonth()];
    const tahun = selectedDate.getFullYear();
    return `${tanggal} ${bulan} ${tahun}`;
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setErrors((prev) => ({ ...prev, date: "" }));
    } else {
      setSelectedDate(null);
    }
  };

  const getDateInputValue = () => {
    if (!selectedDate) return "";
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

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
        date: selectedDate,
        description,
        pemasukan: parseFloat(pemasukan.replace(/[^0-9]/g, "")),
        pengeluaran: parseFloat(pengeluaran.replace(/[^0-9]/g, "")),
      };

      console.log("Data yang akan disimpan:", formData);

      // Tutup modal konfirmasi
      setShowConfirmModal(false);

      // Tampilkan popup sukses
      setMessage("Berhasil Disimpan! Perubahan laporan berhasil disimpan.");
      setPopupType("success");
      setShowPopup(true);

      // Tunggu 2 detik, kemudian redirect
      setTimeout(() => {
        router.push("/admin/laporan-keuangan");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setShowConfirmModal(false);
      setMessage("Terjadi kesalahan saat menyimpan laporan keuangan.");
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
        title="Simpan Laporan Keuangan"
        description="Apakah Anda yakin ingin menyimpan laporan keuangan ini? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />
      <form onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-bold mb-6">Tambah Laporan Keuangan</h1>
        
        <div className="mb-4">
          <label className="block text-xl font-medium mb-2" htmlFor="date">
            Tanggal Laporan
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="date"
                id="date"
                value={getDateInputValue()}
                onChange={handleDateInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div className="flex-1" ref={calendarRef}>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`w-full border rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:border-gray-400 transition-colors bg-white text-left ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <Calendar size={18} className="text-gray-600" />
                <span className={selectedDate ? "text-gray-700" : "text-gray-400"}>
                  {getDisplayText()}
                </span>
              </button>

              {isCalendarOpen && (
                <CalendarPicker
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setErrors((prev) => ({ ...prev, date: "" }));
                    setIsCalendarOpen(false);
                  }}
                  onClose={() => setIsCalendarOpen(false)}
                />
              )}
            </div>
          </div>
          {errors.date && (
            <p className="text-sm text-red-600 mt-1">{errors.date}</p>
          )}
        </div>

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

        <div className="flex justify-end mt-10">
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
              "Simpan Laporan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}